import { useCallback, useRef, useState } from 'react';
import api from '../Script/api';

/**
 * Lazy-loaded, in-memory-cached data for the Brand → Angle → Library cascade.
 *
 * One API call per brand fetches ALL angle groups with their libraries and
 * asset file paths.  Selecting an angle is a pure client-side filter — no
 * additional network request.
 *
 * Cache: Map<brandName, AngleGroup[]>
 * AngleGroup: { angle_alignment: number, libraries: LibraryWithAssets[] }
 */
export const useLibraryData = () => {
  // ── Brands ──────────────────────────────────────────────────────────────────
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [brandsError, setBrandsError] = useState('');
  const brandsLoaded = useRef(false);

  // ── Angle groups (brand → [{ angle_alignment, libraries[] }]) ────────────────
  const groupsCache = useRef(new Map());
  const [angleGroups, setAngleGroups] = useState([]);   // full grouped data
  const [anglesLoading, setAnglesLoading] = useState(false);
  const [anglesError, setAnglesError] = useState('');
  const [activeBrand, setActiveBrand] = useState('');

  // ── Displayed libraries (filtered by selected angle) ─────────────────────────
  const [displayedLibraries, setDisplayedLibraries] = useState([]);
  const [activeAngle, setActiveAngle] = useState(null);

  // ── Actions ──────────────────────────────────────────────────────────────────

  const fetchBrands = useCallback(async () => {
    if (brandsLoaded.current) return;
    setBrandsLoading(true);
    setBrandsError('');
    try {
      const res = await api.all_libraries.brands();
      setBrands(res.data?.data ?? []);
      brandsLoaded.current = true;
    } catch {
      setBrandsError('Could not load brands. Please try again.');
    } finally {
      setBrandsLoading(false);
    }
  }, []);

  /**
   * Called when user picks a brand.
   * Fetches all angle groups with their libraries (including asset file paths).
   * Libraries for ALL angles are now available in memory — no further API calls.
   */
  const fetchAnglesForBrand = useCallback(async (brand) => {
    if (!brand) {
      setAngleGroups([]);
      setDisplayedLibraries([]);
      setActiveBrand('');
      setActiveAngle(null);
      return;
    }

    setActiveBrand(brand);
    setActiveAngle(null);
    setDisplayedLibraries([]);

    if (groupsCache.current.has(brand)) {
      const cached = groupsCache.current.get(brand);
      setAngleGroups(cached);
      // Auto-show ALL libraries so cards appear immediately after brand pick
      setDisplayedLibraries(cached.flatMap((g) => g.libraries));
      return;
    }

    setAnglesLoading(true);
    setAnglesError('');
    try {
      const res = await api.all_libraries.anglesByBrand(brand);
      const groups = res.data?.data ?? [];
      groupsCache.current.set(brand, groups);
      setAngleGroups(groups);
      // Auto-show all libraries — user can then filter by angle if needed
      setDisplayedLibraries(groups.flatMap((g) => g.libraries));
    } catch {
      setAnglesError(`Could not load data for "${brand}". Please try again.`);
      setAngleGroups([]);
      setDisplayedLibraries([]);
    } finally {
      setAnglesLoading(false);
    }
  }, []);

  /**
   * Called when user picks an angle.
   * Pure client-side filter — no network request.
   * @param {number|null} angle  null = show all libraries for the brand
   */
  const selectAngle = useCallback((angle) => {
    setActiveAngle(angle);
    if (angle === null || angle === undefined) {
      // No angle filter — flatten all libraries across all angles
      setDisplayedLibraries(angleGroups.flatMap((g) => g.libraries));
    } else {
      const group = angleGroups.find((g) => g.angle_alignment === angle);
      setDisplayedLibraries(group?.libraries ?? []);
    }
  }, [angleGroups]);

  /**
   * Restore cascade state after a tooth switch (reads persisted brand + angle).
   */
  const restoreForTooth = useCallback(async (brand, angle) => {
    if (!brand) return;
    // Ensure groups are loaded for this brand
    if (!groupsCache.current.has(brand)) {
      await fetchAnglesForBrand(brand);
    }
    const groups = groupsCache.current.get(brand) ?? [];
    setActiveBrand(brand);
    setAngleGroups(groups);
    setActiveAngle(angle ?? null);
    if (angle !== null && angle !== undefined) {
      const group = groups.find((g) => g.angle_alignment === angle);
      setDisplayedLibraries(group?.libraries ?? []);
    } else {
      // No angle saved → show all libraries for the brand
      setDisplayedLibraries(groups.flatMap((g) => g.libraries));
    }
  }, [fetchAnglesForBrand]);

  const reset = useCallback(() => {
    setAngleGroups([]);
    setDisplayedLibraries([]);
    setActiveBrand('');
    setActiveAngle(null);
    setAnglesError('');
  }, []);

  // Convenience: angle objects for the dropdown (angle_alignment + library_count)
  const angles = angleGroups.map((g) => ({
    angle_alignment: g.angle_alignment,
    library_count: g.libraries.length,
  }));

  return {
    // Brands
    brands, brandsLoading, brandsError, fetchBrands,
    // Angles
    angles, angleGroups, anglesLoading, anglesError, activeBrand,
    fetchAnglesForBrand,
    // Libraries (filtered by selected angle)
    displayedLibraries, activeAngle, selectAngle,
    // Utilities
    restoreForTooth, reset,
  };
};
