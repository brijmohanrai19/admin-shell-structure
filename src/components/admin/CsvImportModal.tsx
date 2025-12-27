import { useState } from "react";
import Papa from "papaparse";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Download } from "lucide-react";

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => Promise<void>;
  expectedColumns: string[];
  title: string;
  description: string;
  sampleData?: Record<string, any>[];
  entityName?: string;
}

export function CsvImportModal({
  isOpen,
  onClose,
  onImport,
  expectedColumns,
  title,
  description,
  sampleData,
  entityName = "Record",
}: CsvImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setImportSummary(null);

    // Parse CSV
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError(`CSV parsing error: ${results.errors[0].message}`);
          setParsedData([]);
          return;
        }

        // Validate columns
        const headers = Object.keys(results.data[0] || {});
        const missingColumns = expectedColumns.filter((col) => !headers.includes(col));

        if (missingColumns.length > 0) {
          setError(`Missing required columns: ${missingColumns.join(", ")}`);
          setParsedData([]);
          return;
        }

        setParsedData(results.data);
      },
      error: (error) => {
        setError(`Failed to parse CSV: ${error.message}`);
      },
    });
  };

  const handleImport = async () => {
    if (parsedData.length === 0) {
      setError("No data to import");
      return;
    }

    setImporting(true);
    setError(null);

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < parsedData.length; i++) {
      try {
        await onImport([parsedData[i]]);
        successCount++;
      } catch (err) {
        failedCount++;
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        errors.push(`Row ${i + 1}: ${errorMsg}`);
      }
    }

    setImportSummary({ success: successCount, failed: failedCount, errors });
    setImporting(false);

    if (failedCount === 0) {
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setError(null);
    setImportSummary(null);
    onClose();
  };

  const downloadSampleCsv = () => {
    if (!sampleData || sampleData.length === 0) return;

    // Convert to CSV
    const headers = expectedColumns.join(',');
    const rows = sampleData.map(row =>
      expectedColumns.map(col => {
        const value = row[col] || '';
        // Escape commas and quotes
        if (value.toString().includes(',') || value.toString().includes('"')) {
          return `"${value.toString().replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );

    const csv = [headers, ...rows].join('\n');

    // Create download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sample-${entityName.toLowerCase()}s.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Sample CSV downloaded: sample-${entityName.toLowerCase()}s.csv`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="flex items-center justify-between gap-4">
            <span>{description}</span>
            {sampleData && sampleData.length > 0 && (
              <Button variant="outline" size="sm" onClick={downloadSampleCsv}>
                <Download className="mr-2 h-4 w-4" />
                Download Sample CSV
              </Button>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload */}
          <div className="border-2 border-dashed rounded-lg p-6">
            <div className="flex flex-col items-center gap-2">
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />
              <div className="text-center">
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <Button asChild variant="outline">
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      {file ? "Change File" : "Upload CSV"}
                    </span>
                  </Button>
                </label>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {file && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Expected Columns Info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Expected columns:</strong> {expectedColumns.join(", ")}
            </AlertDescription>
          </Alert>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Import Summary */}
          {importSummary && (
            <Alert variant={importSummary.failed === 0 ? "default" : "destructive"}>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>
                    <strong>Import Complete:</strong> {importSummary.success} succeeded,{" "}
                    {importSummary.failed} failed
                  </p>
                  {importSummary.errors.length > 0 && (
                    <div className="mt-2">
                      <strong>Errors:</strong>
                      <ul className="list-disc list-inside mt-1 text-xs">
                        {importSummary.errors.slice(0, 5).map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                        {importSummary.errors.length > 5 && (
                          <li>... and {importSummary.errors.length - 5} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Preview Table */}
          {parsedData.length > 0 && !importSummary && (
            <div>
              <h4 className="text-sm font-medium mb-2">
                Preview (showing first 5 rows of {parsedData.length} total)
              </h4>
              <div className="border rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {expectedColumns.map((col) => (
                        <th key={col} className="px-4 py-2 text-left font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="border-t">
                        {expectedColumns.map((col) => (
                          <td key={col} className="px-4 py-2">
                            {row[col] || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={importing}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={parsedData.length === 0 || importing || !!importSummary}
          >
            {importing ? "Importing..." : `Import ${parsedData.length} Rows`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
