import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import ChecklistViewer from '@/components/ChecklistViewer';
import { FileText, Search, Copy, Printer, CheckSquare } from 'lucide-react';
import checklistData from '../../data/data.json';

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

const Index = () => {
  const [selectedChecklistId, setSelectedChecklistId] = useState<string>('');
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChecklist, setShowChecklist] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: selectedChecklist ? `${selectedChecklist.title} - ${new Date().toLocaleDateString()}` : 'Maintenance Checklist',
  });

  const handleGenerateChecklist = () => {
    if (!selectedChecklistId) {
      toast({
        title: "Please select a checklist",
        description: "Choose a checklist from the dropdown to generate.",
        variant: "destructive",
      });
      return;
    }

    const checklist = checklistData[selectedChecklistId as keyof typeof checklistData] as ChecklistData;
    setSelectedChecklist(checklist);
    setShowChecklist(true);
    
    toast({
      title: "Checklist generated!",
      description: `${checklist.title} is ready for use.`,
    });
  };

  const handleCopyJSON = () => {
    if (!selectedChecklist) return;
    
    navigator.clipboard.writeText(JSON.stringify(selectedChecklist, null, 2));
    toast({
      title: "JSON copied!",
      description: "Checklist data has been copied to clipboard.",
    });
  };

  const checklists = Object.values(checklistData) as ChecklistData[];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 mr-3" />
            <h1 className="text-4xl font-bold">Maintenance Checklist Generator</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate professional maintenance checklists for your equipment and workflows
          </p>
        </motion.div>

        {/* Main Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckSquare className="h-5 w-5 mr-2" />
                Select Checklist
              </CardTitle>
              <CardDescription>
                Choose a maintenance checklist to generate and customize
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedChecklistId} onValueChange={setSelectedChecklistId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a maintenance checklist..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  {checklists.map((checklist) => (
                    <SelectItem key={checklist.id} value={checklist.id}>
                      {checklist.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleGenerateChecklist}
                className="w-full"
                size="lg"
                disabled={!selectedChecklistId}
              >
                Generate Checklist
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Actions */}
        <AnimatePresence>
          {showChecklist && selectedChecklist && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto mb-6"
            >
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search checklist items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleCopyJSON}
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy JSON
                      </Button>
                      <Button
                        onClick={handlePrint}
                        className="flex items-center gap-2"
                      >
                        <Printer className="h-4 w-4" />
                        Print
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checklist Display */}
        <AnimatePresence>
          {showChecklist && selectedChecklist && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <ChecklistViewer 
                ref={printRef}
                checklist={selectedChecklist}
                searchQuery={searchQuery}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome State */}
        {!showChecklist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ready to Generate</h3>
              <p className="text-muted-foreground">
                Select a checklist from the dropdown above to get started with your maintenance workflow.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;
