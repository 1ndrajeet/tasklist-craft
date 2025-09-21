import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ChecklistData {
  id: string;
  title: string;
  equipment: string;
  industry: string;
  frequency: string;
  estimatedTime: string;
  version: string;
  lastUpdated: string;
  sections: {
    [key: string]: string[];
  };
}

interface ChecklistViewerProps {
  checklist: ChecklistData;
  searchQuery: string;
}

const ChecklistViewer = forwardRef<HTMLDivElement, ChecklistViewerProps>(
  ({ checklist, searchQuery }, ref) => {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const handleItemCheck = (sectionName: string, itemIndex: number) => {
      const key = `${sectionName}-${itemIndex}`;
      setCheckedItems(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    };

    const filterItems = (items: string[]) => {
      if (!searchQuery) return items;
      return items.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };

    const sectionOrder = [
      'Safety Precautions',
      'Required Tools and Equipment',
      'Pre-Maintenance Procedures',
      'Cleaning Procedures',
      'Mechanical Inspection',
      'Calibration',
      'Lubrication',
      'Quality Checks',
      'Documentation',
      'Final Checks',
      'Notes'
    ];

    return (
      <div ref={ref} className="max-w-4xl mx-auto p-6 bg-background">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{checklist.title}</h1>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Badge variant="secondary">{checklist.equipment}</Badge>
            <Badge variant="secondary">{checklist.industry}</Badge>
            <Badge variant="secondary">{checklist.frequency}</Badge>
          </div>
        </div>

        {/* Metadata */}
        <div className="card-elevated p-6 mb-8">
          <h2 className="section-header">Checklist Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="metadata-item">
              <span className="font-medium">Equipment:</span>
              <span className="text-muted-foreground">{checklist.equipment}</span>
            </div>
            <div className="metadata-item">
              <span className="font-medium">Industry:</span>
              <span className="text-muted-foreground">{checklist.industry}</span>
            </div>
            <div className="metadata-item">
              <span className="font-medium">Frequency:</span>
              <span className="text-muted-foreground">{checklist.frequency}</span>
            </div>
            <div className="metadata-item">
              <span className="font-medium">Estimated Time:</span>
              <span className="text-muted-foreground">{checklist.estimatedTime}</span>
            </div>
            <div className="metadata-item">
              <span className="font-medium">Version:</span>
              <span className="text-muted-foreground">{checklist.version}</span>
            </div>
            <div className="metadata-item">
              <span className="font-medium">Last Updated:</span>
              <span className="text-muted-foreground">{formatDate(checklist.lastUpdated)}</span>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sectionOrder.map((sectionName) => {
            const items = checklist.sections[sectionName] || [];
            const filteredItems = filterItems(items);
            
            if (filteredItems.length === 0 && searchQuery) return null;

            return (
              <motion.div
                key={sectionName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="card-elevated p-6"
              >
                <h3 className="section-header">{sectionName}</h3>
                <div className="space-y-3">
                  <AnimatePresence>
                    {filteredItems.map((item, index) => {
                      const key = `${sectionName}-${index}`;
                      const isChecked = checkedItems[key] || false;
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="checklist-item"
                        >
                          <Checkbox
                            id={key}
                            checked={isChecked}
                            onCheckedChange={() => handleItemCheck(sectionName, index)}
                            className="mt-1"
                          />
                          <label
                            htmlFor={key}
                            className={`flex-1 text-sm cursor-pointer leading-relaxed ${
                              isChecked ? 'line-through text-muted-foreground' : 'text-foreground'
                            }`}
                          >
                            {item}
                          </label>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  {filteredItems.length === 0 && !searchQuery && (
                    <p className="text-sm text-muted-foreground italic">No items in this section</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sign-Off Section (for print only) */}
        <div className="card-elevated p-6 mt-8 print-only">
          <h3 className="section-header">Sign-Off</h3>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <span className="font-medium min-w-[120px]">Technician Name:</span>
              <div className="flex-1 border-b border-border h-8"></div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-medium min-w-[120px]">Date:</span>
              <div className="flex-1 border-b border-border h-8"></div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-medium min-w-[120px]">Supervisor Review:</span>
              <div className="flex-1 border-b border-border h-8"></div>
            </div>
          </div>
        </div>

        <style>{`
          @media print {
            .print-only {
              display: block !important;
            }
          }
          @media screen {
            .print-only {
              display: none;
            }
          }
        `}</style>
      </div>
    );
  }
);

ChecklistViewer.displayName = 'ChecklistViewer';

export default ChecklistViewer;