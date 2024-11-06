'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UploadPPMPProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenDialog: () => void;
}

const UploadPPMP: React.FC<UploadPPMPProps> = ({ onUpload, onOpenDialog }) => (
  <div className="grid w-full max-w-sm items-center gap-5">
    <Label htmlFor="excel">Upload PPMP</Label>
    <div className="flex items-center justify-between">
      <Input id="excel" type="file" onChange={onUpload} className="flex-1" />
      <Button className="ml-2" onClick={onOpenDialog}>
        Create PPMP
      </Button>
    </div>
  </div>
);

export default UploadPPMP;