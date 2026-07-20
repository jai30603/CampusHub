from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.dependencies.auth import get_db, get_current_user
from app.models.message import Conversation, Message
from app.models.listing import Listing
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.message import ConversationResponse, ConversationStart, MessageCreate, MessageResponse
from app.services.notification_service import create_notification

router = APIRouter(prefix="/conversations", tags=["Conversations & Messaging"])

@router.get("", response_model=APIResponse[List[ConversationResponse]])
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all conversations for the currently logged-in user.
    """
    # Query conversations where user is buyer OR seller
    conversations = db.query(Conversation).options(
        joinedload(Conversation.listing).joinedload(Listing.seller),
        joinedload(Conversation.listing).joinedload(Listing.category),
        joinedload(Conversation.listing).joinedload(Listing.images),
        joinedload(Conversation.buyer),
        joinedload(Conversation.seller)
    ).filter(
        (Conversation.buyer_id == current_user.id) | (Conversation.seller_id == current_user.id)
    ).order_by(Conversation.last_message_at.desc()).all()

    resp_items = []
    for conv in conversations:
        # Determine who the "other user" is
        other_user = conv.seller if conv.buyer_id == current_user.id else conv.buyer
        
        # Calculate unread count (messages sent by other user that are not read)
        unread_count = db.query(Message).filter(
            Message.conversation_id == conv.id,
            Message.sender_id != current_user.id,
            Message.is_read == False
        ).count()

        # Get last message text
        last_msg_obj = db.query(Message).filter(
            Message.conversation_id == conv.id
        ).order_by(Message.created_at.desc()).first()
        last_message = last_msg_obj.message if last_msg_obj else None

        conv_dict = ConversationResponse.model_validate(conv)
        conv_dict.other_user = other_user
        conv_dict.last_message = last_message
        conv_dict.unread_count = unread_count
        resp_items.append(conv_dict)

    return APIResponse(
        success=True,
        message="Conversations retrieved",
        data=resp_items
    )

@router.post("/start", response_model=APIResponse[ConversationResponse])
def start_conversation(
    conv_start: ConversationStart,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Start a conversation for a listing. Creates a new one or returns existing one.
    """
    listing = db.query(Listing).filter(Listing.id == conv_start.listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    if listing.seller_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot contact yourself on your own listing."
        )

    # Check if conversation already exists between current user (as buyer) and listing
    existing = db.query(Conversation).filter(
        Conversation.listing_id == listing.id,
        Conversation.buyer_id == current_user.id
    ).first()

    if existing:
        return get_single_conversation_details(existing.id, db, current_user)

    new_conv = Conversation(
        listing_id=listing.id,
        buyer_id=current_user.id,
        seller_id=listing.seller_id
    )
    db.add(new_conv)
    db.commit()
    db.refresh(new_conv)

    return get_single_conversation_details(new_conv.id, db, current_user)

@router.get("/{conversation_id}", response_model=APIResponse[ConversationResponse])
def get_conversation_detail(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve details and message history for a specific conversation.
    """
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    if conv.buyer_id != current_user.id and conv.seller_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this conversation")

    return get_single_conversation_details(conversation_id, db, current_user)

@router.get("/{conversation_id}/messages", response_model=APIResponse[List[MessageResponse]])
def get_conversation_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve message history for a specific conversation.
    """
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    if conv.buyer_id != current_user.id and conv.seller_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.asc()).all()

    resp_msgs = [MessageResponse.model_validate(m) for m in messages]
    return APIResponse(success=True, message="Message history loaded", data=resp_msgs)

@router.post("/{conversation_id}/messages", response_model=APIResponse[MessageResponse])
def send_message(
    conversation_id: int,
    msg_in: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Send a message within an existing conversation.
    """
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    if conv.buyer_id != current_user.id and conv.seller_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    if not msg_in.message.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message content cannot be empty")

    new_msg = Message(
        conversation_id=conversation_id,
        sender_id=current_user.id,
        message=msg_in.message.strip(),
        is_read=False
    )
    db.add(new_msg)
    
    # Update last message timestamp
    conv.last_message_at = func.now()
    
    db.commit()
    db.refresh(new_msg)

    # Trigger notification
    recipient_id = conv.seller_id if current_user.id == conv.buyer_id else conv.buyer_id
    create_notification(
        db,
        recipient_id,
        "messages",
        "New Message",
        f"{current_user.full_name} sent you a message.",
        "conversation",
        conv.id
    )

    return APIResponse(
        success=True,
        message="Message sent successfully",
        data=MessageResponse.model_validate(new_msg)
    )

@router.put("/{conversation_id}/read", response_model=APIResponse[dict])
def mark_conversation_as_read(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark all incoming messages in a conversation as read.
    """
    db.query(Message).filter(
        Message.conversation_id == conversation_id,
        Message.sender_id != current_user.id,
        Message.is_read == False
    ).update({"is_read": True}, synchronize_session=False)
    
    db.commit()
    return APIResponse(success=True, message="Messages marked as read", data=None)


# Helper helper
def get_single_conversation_details(conversation_id: int, db: Session, current_user: User):
    conv = db.query(Conversation).options(
        joinedload(Conversation.listing).joinedload(Listing.seller),
        joinedload(Conversation.listing).joinedload(Listing.category),
        joinedload(Conversation.listing).joinedload(Listing.images),
        joinedload(Conversation.buyer),
        joinedload(Conversation.seller)
    ).filter(Conversation.id == conversation_id).first()

    other_user = conv.seller if conv.buyer_id == current_user.id else conv.buyer
    
    unread_count = db.query(Message).filter(
        Message.conversation_id == conv.id,
        Message.sender_id != current_user.id,
        Message.is_read == False
    ).count()

    last_msg_obj = db.query(Message).filter(
        Message.conversation_id == conv.id
    ).order_by(Message.created_at.desc()).first()
    last_message = last_msg_obj.message if last_msg_obj else None

    conv_resp = ConversationResponse.model_validate(conv)
    conv_resp.other_user = other_user
    conv_resp.last_message = last_message
    conv_resp.unread_count = unread_count
    
    return APIResponse(success=True, message="Conversation details loaded", data=conv_resp)
