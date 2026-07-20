import React, { useState, useEffect, useMemo } from 'react';
import { Container } from '@/components/common/Container';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { FilterSidebar, type FilterState } from '@/components/marketplace/FilterSidebar';
import { FilterDrawer } from '@/components/marketplace/FilterDrawer';
import { ListingGrid } from '@/components/marketplace/ListingGrid';
import { ListingList } from '@/components/marketplace/ListingList';
import { ViewToggle } from '@/components/marketplace/ViewToggle';
import { Pagination } from '@/components/marketplace/Pagination';
import { MarketplaceSkeleton } from '@/components/marketplace/MarketplaceSkeleton';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { type ListingItem } from '@/data/mockListings';
import { apiRequest } from '@/services/api';
import { Filter, Sparkles, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const Marketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<Array<{ id: number; name: string; slug: string }>>([]);
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    category: '',
    college: '',
    condition: '',
    maxPrice: 50000,
    sortBy: 'newest',
  });

  // Fetch Categories from Backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiRequest('/categories');
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch Real Listings from Backend with Query Filters
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const selectedCat = categories.find((c) => c.name === filters.category);
        const params = new URLSearchParams();
        if (selectedCat) params.append('category_id', String(selectedCat.id));
        if (searchTerm.trim()) params.append('search', searchTerm.trim());
        if (filters.college) params.append('college', filters.college);
        if (filters.condition) params.append('condition', filters.condition);
        if (filters.maxPrice < 50000) params.append('max_price', String(filters.maxPrice));
        if (filters.sortBy) params.append('sort_by', filters.sortBy);

        const response = await apiRequest(`/listings?${params.toString()}`);
        if (response.success && response.data) {
          // Transform backend schema to frontend ListingItem
          const transformed: ListingItem[] = response.data.map((l: any) => ({
            id: String(l.id),
            title: l.title,
            description: l.description,
            price: Number(l.price),
            category: l.category?.name || 'General',
            condition: l.condition,
            college: l.seller?.college || 'IIT Bombay',
            createdAt: new Date(l.created_at).toLocaleDateString(),
            images: l.images && l.images.length > 0 ? l.images.map((img: any) => img.image_url) : [
              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
            ],
            seller: {
              id: String(l.seller?.id || 1),
              name: l.seller?.full_name || 'Student Seller',
              college: l.seller?.college || 'IIT Bombay',
              avatarUrl: l.seller?.avatar,
              rating: 4.9,
              totalListings: 3,
              joinedDate: '2024',
              verifiedStudent: l.seller?.is_verified ?? true,
            },
            attributes: l.attributes || {},
          }));
          setListings(transformed);
        }
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [searchTerm, filters, categories]);

  const handleFilterChange = (key: keyof FilterState, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      college: '',
      condition: '',
      maxPrice: 50000,
      sortBy: 'newest',
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const itemsPerPage = 9;
  const totalPages = Math.ceil(listings.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return listings.slice(start, start + itemsPerPage);
  }, [listings, currentPage]);

  return (
    <Container className="py-8 space-y-8">
      <PageHeader
        title="Campus Marketplace"
        description="Browse textbooks, study notes, electronics, and gear listed by verified students"
        action={
          <Link to={ROUTES.SELL}>
            <Button leftIcon={<PlusCircle className="w-4 h-4" />}>Post New Listing</Button>
          </Link>
        }
      />

      {/* Category Horizon Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleFilterChange('category', '')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            !filters.category
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
        >
          All Categories
        </button>

        {categories.map((cat) => {
          const isSelected = filters.category === cat.name;
          return (
            <button
              key={cat.id}
              onClick={() => handleFilterChange('category', cat.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Search Bar & View Mode Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={(term) => {
              setSearchTerm(term);
              setCurrentPage(1);
            }}
            onClear={() => setSearchTerm('')}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsMobileFilterOpen(true)}
            leftIcon={<Filter className="w-4 h-4" />}
            className="lg:hidden"
          >
            Filters
          </Button>

          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        </div>
      </div>

      {/* Main Grid & Filter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        <FilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Listings Result Container */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-3">
            <span>
              Showing <strong className="text-foreground">{listings.length}</strong> campus listings
            </span>
            {filters.category && (
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="w-3 h-3 text-primary" /> {filters.category}
              </Badge>
            )}
          </div>

          {isLoading ? (
            <MarketplaceSkeleton count={6} />
          ) : listings.length === 0 ? (
            <EmptyState
              title="No campus listings found"
              description="No active listings match your selected search or filter criteria. Be the first to post one!"
              actionText="Post New Listing"
              onAction={() => {}}
            />
          ) : viewMode === 'grid' ? (
            <ListingGrid items={paginatedItems} />
          ) : (
            <ListingList items={paginatedItems} />
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </Container>
  );
};
