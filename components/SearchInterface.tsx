import React, { useState } from 'react';
import { Search, Upload, FileText, Gem } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  onFileUpload: (files: FileList) => void;
}

export function SearchInterface({ onSearch, onFileUpload }: SearchInterfaceProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Gem className="h-8 w-8 text-primary" />
          <h1 className="text-4xl">JewelAI</h1>
        </div>
        <p className="text-muted-foreground">Professional Jewelry Appraisal & Price Prediction</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Describe your jewelry (e.g., '2 carat diamond ring', 'vintage gold necklace')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 h-14 text-base rounded-full border-2 focus:border-primary"
          />
        </div>
        <div className="flex justify-center mt-6 gap-4">
          <Button type="submit" size="lg" className="px-8">
            Get Appraisal
          </Button>
          <Button type="button" variant="outline" size="lg" className="px-8">
            I'm Feeling Lucky
          </Button>
        </div>
      </form>

      {/* Upload Options */}
      <Card className="p-6">
        <h3 className="mb-4 text-center">Or upload files for detailed analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image Upload */}
          <div className="relative">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors"
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="font-medium">Upload Images</span>
              <span className="text-sm text-muted-foreground">JPG, PNG, HEIC</span>
            </label>
          </div>

          {/* Document Upload */}
          <div className="relative">
            <input
              type="file"
              id="document-upload"
              accept=".pdf,.doc,.docx"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="document-upload"
              className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors"
            >
              <FileText className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="font-medium">Upload Certificates</span>
              <span className="text-sm text-muted-foreground">GIA, EGL, AGS</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Quick Examples */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            'Diamond engagement ring',
            'Rolex watch appraisal',
            'Pearl necklace value',
            'Gold bracelet price',
            'Vintage brooch'
          ].map((example) => (
            <Button
              key={example}
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery(example)}
              className="text-xs"
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}