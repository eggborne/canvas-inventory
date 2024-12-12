import { InventoryItem } from "./types";
import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import styles from './DataDisplay.module.css';

type DataDisplayProps = {
  data: InventoryItem[];
};

type GroupedItem = InventoryItem & { quantity: number };
type SortKey = 'quantity' | 'location' | 'dimensions' | 'origin' | 'packaging' | 'notes';
type SortDirection = 'asc' | 'desc';

const DataDisplay: React.FC<DataDisplayProps> = ({ data }) => {
  const [groupIdentical, setGroupIdentical] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('location');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortData = (items: (InventoryItem | GroupedItem)[], key: SortKey, direction: SortDirection) => {
    return [...items].sort((a, b) => {
      let valueA: string | number;
      let valueB: string | number;

      if (key === 'dimensions') {
        // Sort by total area (height × width)
        valueA = a.height * a.width;
        valueB = b.height * b.width;
      } else if (key === 'quantity' && 'quantity' in a && 'quantity' in b) {
        valueA = a.quantity || '';
        valueB = b.quantity || '';
      } else {
        valueA = a[key] || '';
        valueB = b[key] || '';
      }

      const comparison = typeof valueA === 'number' && typeof valueB === 'number'
        ? valueA - valueB
        : String(valueA).localeCompare(String(valueB));

      return direction === 'asc' ? comparison : -comparison;
    });
  };

  const processedData = useMemo(() => {
    let processed = data;

    if (groupIdentical) {
      const groups = data.reduce<Record<string, GroupedItem>>((acc, item) => {
        const key = `${item.location}-${item.origin}-${item.height}-${item.width}-${item.depth}-${item.packaging}-${item.notes}`;
        if (!acc[key]) {
          acc[key] = { ...item, quantity: 1 };
        } else {
          acc[key].quantity++;
        }
        return acc;
      }, {});
      processed = Object.values(groups);
    }

    return sortData(processed, sortKey, sortDirection);
  }, [data, groupIdentical, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown className={styles.sortIcon} />;
    }
    return sortDirection === 'asc'
      ? <ArrowUp className={`${styles.sortIcon} ${styles.active}`} />
      : <ArrowDown className={`${styles.sortIcon} ${styles.active}`} />;
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={groupIdentical}
            onChange={(e) => setGroupIdentical(e.target.checked)}
            className={styles.toggleInput}
          />
          Group identical items
        </label>
      </div>

      {/* Mobile view */}
      <div className={styles.mobileView}>
        {processedData.map((item, index) => (
          <div key={item.id + '-' + index} className={styles.card}>
            <div className={styles.cardGrid}>
              {groupIdentical && (
                <>
                  <div className={styles.label}>Quantity:</div>
                  <div>{(item as GroupedItem).quantity}</div>
                </>
              )}
              <div className={styles.label}>Location:</div>
              <div>{item.location}</div>
              <div className={styles.label}>Origin:</div>
              <div>{item.origin || 'Unknown'}</div>
              <div className={styles.label}>Dimensions:</div>
              <div>{item.height}″ × {item.width}″ × {item.depth}″</div>
              <div className={styles.label}>Packaging:</div>
              <div>{item.packaging || 'Loose'}</div>
              {item.notes && (
                <>
                  <div className={styles.label}>Notes:</div>
                  <div>{item.notes}</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view */}
      <div className={styles.desktopView}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              {groupIdentical && (
                <th onClick={() => handleSort('quantity')}>
                  <div className={styles.headerContent}>
                    Qty <SortIcon columnKey="quantity" />
                  </div>
                </th>
              )}
              <th onClick={() => handleSort('location')}>
                <div className={styles.headerContent}>
                  Location <SortIcon columnKey="location" />
                </div>
              </th>
              <th onClick={() => handleSort('dimensions')}>
                <div className={styles.headerContent}>
                  Dimensions <SortIcon columnKey="dimensions" />
                </div>
              </th>
              <th onClick={() => handleSort('origin')}>
                <div className={styles.headerContent}>
                  Origin <SortIcon columnKey="origin" />
                </div>
              </th>
              <th onClick={() => handleSort('packaging')}>
                <div className={styles.headerContent}>
                  Packaging <SortIcon columnKey="packaging" />
                </div>
              </th>
              <th onClick={() => handleSort('notes')}>
                <div className={styles.headerContent}>
                  Notes <SortIcon columnKey="notes" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {processedData.map((item, index) => (
              <tr key={item.id + '-' + index}>
                {groupIdentical && <td>{(item as GroupedItem).quantity}</td>}
                <td>{item.location}</td>
                <td className={styles.dimensions}>
                  <strong>{item.height}</strong> × <strong>{item.width}</strong> × {item.depth}
                </td>
                <td style={{ fontSize: '85%', lineHeight: 1 }}>{item.origin || 'Unknown'}</td>
                <td style={{ fontSize: '85%', lineHeight: 1 }}>{item.packaging || 'Loose'}</td>
                <td>{item.notes || '-'}</td>
                {!groupIdentical && <td><button className={'edit-button'} type='button'>Edit</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataDisplay;