"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Spinner from "@/components/Spinner";
import { type MenuItem } from "@/types/imenuItems";
import "@/assets/CSS/menu-page.css";
import axiosInstance from "@/libs/axiosInstance";
import { useSearchParams } from "next/navigation";

type SortKey = "featured" | "price-asc" | "price-desc" | "az";

const SORT_LABELS: Record<SortKey, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  az: "Name: A to Z",
};

export default function MenuPage() {
    const searchParam = useSearchParams();
    const param = searchParam.get("category");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
    const [sortKey, setSortKey] = useState<SortKey>("featured");
    

  useEffect(() => {
    let cancelled = false;

    const fetchItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axiosInstance.get("/get/items", {
            params: param ? {search:param} : {}
        });
        if (response.status === 200 || response.status === 304) {
          if (!cancelled) setItems(response.data.items);
        }
      } catch (err) {
        console.log(err);
        if (!cancelled) setError("Couldn't load the menu right now. Please try again shortly.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchItems();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((item) => item.categoryName)));
    return ["All", ...unique];
  }, [items]);

  const visibleItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    const filtered = items.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.categoryName === activeCategory;
      const matchesSearch =
        term.length === 0 ||
        item.itemName.toLowerCase().includes(term) ||
        item.itemDescription.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "price-asc":
          return a.itemPrice - b.itemPrice;
        case "price-desc":
          return b.itemPrice - a.itemPrice;
        case "az":
          return a.itemName.localeCompare(b.itemName);
        case "featured":
        default:
          return (b.badge ? 1 : 0) - (a.badge ? 1 : 0);
      }
    });

    return sorted;
  }, [items, search, activeCategory, sortKey]);

  return (
    <main className="menu-page">
      <header className="menu-hero">
        <div className="menu-hero-glow" aria-hidden="true" />

        <div className="menu-eyebrow-row">
          <span className="menu-eyebrow-line" />
          <span className="menu-eyebrow">Wood-Fired Kitchen</span>
          <span className="menu-eyebrow-line" />
        </div>

        <h1 className="menu-title">The Menu</h1>
        <p className="menu-subtitle">
          Every dish, ember-kissed and plated to order — search, sort, and filter to find what you&apos;re craving.
        </p>

        <div className="menu-ornament" aria-hidden="true">
          <span className="menu-ornament-line" />
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M5 0L10 5L5 10L0 5Z" fill="#d4a24c" />
          </svg>
          <span className="menu-ornament-line" />
        </div>
      </header>

      <div className="menu-toolbar">
        <div className="menu-controls">
          <div className="menu-search-box">
            <svg
              className="menu-search-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes, ingredients..."
              aria-label="Search menu"
              className="menu-search-input"
            />
            {search.length > 0 && (
              <button
                type="button"
                className="menu-clear-button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="menu-sort-box">
            <label htmlFor="menu-sort" className="menu-sort-label">
              Sort
            </label>
            <select
              id="menu-sort"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="menu-sort-select"
            >
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <option key={key} value={key}>
                  {SORT_LABELS[key]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {categories.length > 1 && (
          <div className="menu-tabs" role="tablist" aria-label="Filter by category">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                className={`menu-tab ${activeCategory === category ? "menu-tab-active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="menu-result-count" aria-live="polite">
        {!isLoading && !error && (
          <span>
            {visibleItems.length} {visibleItems.length === 1 ? "dish" : "dishes"}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="menu-center-state">
          <Spinner size={48} />
        </div>
      )}

      {!isLoading && error && (
        <div className="menu-error-state">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && visibleItems.length === 0 && (
        <div className="menu-empty-state">
          <p className="menu-empty-title">No dishes found</p>
          <p className="menu-empty-body">Try a different search term or category.</p>
          <button
            type="button"
            className="menu-reset-button"
            onClick={() => {
              setSearch("");
              setActiveCategory("All");
            }}
          >
            Reset filters
          </button>
        </div>
      )}

      {!isLoading && !error && visibleItems.length > 0 && (
        <div className="menu-grid">
          {visibleItems.map((item, index) => {
            const image = item.itemImages?.[0]?.secure_url;
            return (
              <article
                key={item.id}
                className="menu-card"
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              >
                <div className="menu-image-wrap">
                  {image ? (
                    <Image
                      src={image}
                      alt={item.itemName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="menu-image"
                    />
                  ) : (
                    <div className="menu-image-placeholder" aria-hidden="true" />
                  )}

                  <div className="menu-image-overlay" aria-hidden="true" />

                  {item.badge && (
                    <span className="menu-badge">
                      <svg
                        className="menu-badge-flame"
                        viewBox="0 0 24 24"
                        width="11"
                        height="11"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 2c1 3-2 4-2 7a4 4 0 0 0 8 0c0-1-.5-2-1-3 1 0 3 2 3 6a6 6 0 0 1-12 0c0-4 2-6 4-10z" />
                      </svg>
                      {item.badge}
                    </span>
                  )}

                  <span className="menu-category-chip">{item.categoryName}</span>
                </div>

                <div className="menu-card-body">
                  <div className="menu-price-line">
                    <span className="menu-item-name">{item.itemName}</span>
                    <span className="menu-leader" aria-hidden="true" />
                    <span className="menu-price">${item.itemPrice.toFixed(2)}</span>
                  </div>

                  <p className="menu-description">{item.itemDescription}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}