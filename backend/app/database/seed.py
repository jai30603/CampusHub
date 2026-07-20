import secrets

from sqlalchemy.orm import Session
from app.models.category import Category
from app.models.listing import Listing, ListingImage
from app.models.user import User
from app.core.security import hash_password

DEFAULT_CATEGORIES = [
    {"name": "Books & Textbooks", "slug": "books-textbooks", "icon": "BookOpen"},
    {"name": "Study Notes", "slug": "study-notes", "icon": "FileText"},
    {"name": "Previous Year Papers", "slug": "previous-year-papers", "icon": "FileSpreadsheet"},
    {"name": "Lab Manuals", "slug": "lab-manuals", "icon": "FlaskConical"},
    {"name": "Electronics & Gear", "slug": "electronics-gear", "icon": "Laptop"},
    {"name": "Scientific Calculators", "slug": "scientific-calculators", "icon": "Calculator"},
    {"name": "Stationery & Accessories", "slug": "stationery-accessories", "icon": "PenTool"},
    {"name": "Campus Merchandise", "slug": "campus-merchandise", "icon": "GraduationCap"},
    {"name": "Free Donations", "slug": "free-donations", "icon": "HeartHandshake"},
]

def seed_categories(db: Session) -> None:
    """Seeds default campus marketplace categories if not already present."""
    for cat_data in DEFAULT_CATEGORIES:
        existing = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
        if not existing:
            new_cat = Category(
                name=cat_data["name"],
                slug=cat_data["slug"],
                icon=cat_data["icon"],
                is_active=True,
            )
            db.add(new_cat)
    db.commit()


SAMPLE_SELLERS = [
    {"full_name": "Aarav Mehta", "email": "aarav.demo@example.com"},
    {"full_name": "Priya Sharma", "email": "priya.demo@example.com"},
    {"full_name": "Rohan Kapoor", "email": "rohan.demo@example.com"},
]

SAMPLE_LISTINGS = [
    {"title": "Scientific Calculator FX-991ES Plus", "description": "Fully working calculator with cover. Ideal for engineering and science exams.", "price": 650, "condition": "Like New", "category": "scientific-calculators", "seller": "aarav.demo@example.com", "attributes": {"brand": "Casio", "model": "FX-991ES Plus"}, "image": "https://images.unsplash.com/photo-1611125838949-a0390e0c0b3e?auto=format&fit=crop&w=900&q=80"},
    {"title": "Data Structures and Algorithms Textbook", "description": "Clean copy with a few highlighted sections. Covers arrays, trees, graphs and sorting.", "price": 320, "condition": "Good", "category": "books-textbooks", "seller": "priya.demo@example.com", "attributes": {"subject": "Computer Science", "semester": "3"}, "image": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=900&q=80"},
    {"title": "USB-C Hub with HDMI and Card Reader", "description": "Seven-port USB-C hub with HDMI output, USB-A ports and SD card reader.", "price": 900, "condition": "Like New", "category": "electronics-gear", "seller": "rohan.demo@example.com", "attributes": {"ports": "HDMI, USB-A, SD", "compatibility": "USB-C laptops"}, "image": "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80"},
    {"title": "Organic Chemistry Handwritten Notes", "description": "Concise reaction mechanisms, named reactions and exam-focused revision sheets.", "price": 120, "condition": "Good", "category": "study-notes", "seller": "priya.demo@example.com", "attributes": {"subject": "Chemistry", "format": "Handwritten"}, "image": "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=900&q=80"},
    {"title": "Mechanical Engineering Lab Manual Set", "description": "Complete set of lab manuals for workshop, materials and thermodynamics practicals.", "price": 240, "condition": "Good", "category": "lab-manuals", "seller": "aarav.demo@example.com", "attributes": {"department": "Mechanical Engineering", "semester": "4"}, "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80"},
    {"title": "Set of Previous Year Exam Papers", "description": "Organized papers for core computer science subjects with a topic index.", "price": 80, "condition": "Good", "category": "previous-year-papers", "seller": "rohan.demo@example.com", "attributes": {"department": "Computer Science", "years": "2021-2025"}, "image": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=80"},
    {"title": "Campus Hoodie, Size M", "description": "Comfortable navy campus hoodie in excellent condition. Worn only a few times.", "price": 450, "condition": "Like New", "category": "campus-merchandise", "seller": "aarav.demo@example.com", "attributes": {"size": "M", "color": "Navy"}, "image": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80"},
    {"title": "Free A4 Drawing Sheets and Chart Paper", "description": "Unused drawing sheets and chart paper. Free for anyone who can collect them.", "price": 0, "condition": "Brand New", "category": "free-donations", "seller": "priya.demo@example.com", "attributes": {"quantity": "25 sheets"}, "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80"},
]


def seed_sample_marketplace(db: Session) -> None:
    """Seed a small, idempotent catalog so new deployments are not empty."""
    seed_categories(db)

    for seller_data in SAMPLE_SELLERS:
        if not db.query(User).filter(User.email == seller_data["email"]).first():
            db.add(User(
                full_name=seller_data["full_name"],
                email=seller_data["email"],
                password_hash=hash_password(secrets.token_urlsafe(32)),
                college="",
                role="user",
                is_verified=True,
            ))
    db.commit()

    categories = {category.slug: category for category in db.query(Category).all()}
    sample_emails = [seller["email"] for seller in SAMPLE_SELLERS]
    sellers = {seller.email: seller for seller in db.query(User).filter(User.email.in_(sample_emails)).all()}

    for listing_data in SAMPLE_LISTINGS:
        if db.query(Listing).filter(Listing.title == listing_data["title"]).first():
            continue

        listing = Listing(
            title=listing_data["title"], description=listing_data["description"],
            price=listing_data["price"], condition=listing_data["condition"],
            category_id=categories[listing_data["category"]].id,
            seller_id=sellers[listing_data["seller"]].id,
            attributes=listing_data["attributes"], status="active",
        )
        db.add(listing)
        db.flush()
        db.add(ListingImage(listing_id=listing.id, image_url=listing_data["image"], sort_order=0))

    db.commit()
