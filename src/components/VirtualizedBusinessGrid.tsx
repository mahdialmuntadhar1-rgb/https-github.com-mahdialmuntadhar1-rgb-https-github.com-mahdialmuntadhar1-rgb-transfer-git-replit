/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Business, Category, City } from '../types';
import BusinessCard from './BusinessCard';

interface VirtualizedBusinessGridProps {
  items: Business[];
  categories: Category[];
  cities: City[];
  onBusinessClick: (business: Business) => void;
  debouncedSearchQuery: string;
}

const VirtualizedBusinessGrid = React.memo(({ 
  items, 
  categories, 
  cities, 
  onBusinessClick, 
  debouncedSearchQuery 
}: VirtualizedBusinessGridProps) => {
  return (
    <div style={{ height: '800px', width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => {
          const columnCount = width > 1024 ? 3 : width > 768 ? 2 : 1;
          const rowCount = Math.ceil(items.length / columnCount);
          const columnWidth = width / columnCount;
          const rowHeight = 450; 

          return (
            <FixedSizeGrid
              columnCount={columnCount}
              columnWidth={columnWidth}
              height={height}
              rowCount={rowCount}
              rowHeight={rowHeight}
              width={width}
              style={{ overflowX: 'hidden' }}
            >
              {({ columnIndex, rowIndex, style }) => {
                const index = rowIndex * columnCount + columnIndex;
                const business = items[index];

                if (!business) return null;

                const category = categories.find(c => c.id === business.category_id);
                const city = cities.find(c => c.id === business.city_id);

                return (
                  <div style={{ ...style, padding: '12px' }}>
                    <BusinessCard
                      business={business}
                      category={category}
                      city={city}
                      onClick={() => onBusinessClick(business)}
                      debouncedSearchQuery={debouncedSearchQuery}
                    />
                  </div>
                );
              }}
            </FixedSizeGrid>
          );
        }}
      </AutoSizer>
    </div>
  );
});

export default VirtualizedBusinessGrid;
