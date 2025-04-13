import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClassType, PaymentMethod } from "@/utils/types";
import { FilePlus, Upload } from "lucide-react";

const AddStudent = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    startDate: "",
    endDate: "", // Optional
    payment: "",
    paymentMethod: "" as PaymentMethod,
    classType: "" as ClassType,
    notes: "",
    picture: null as File | null
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, picture: file }));
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.name || !formData.startDate || !formData.payment || !formData.paymentMethod || !formData.classType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: `Student ${formData.name} has been added successfully.`
      });
      
      // Reset form
      setFormData({
        name: "",
        studentId: "",
        startDate: "",
        endDate: "",
        payment: "",
        paymentMethod: "" as PaymentMethod,
        classType: "" as ClassType,
        notes: "",
        picture: null
      });
      setPreviewUrl(null);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <FilePlus className="h-6 w-6 mr-2 text-teacher-500" />
        <h1 className="text-3xl font-bold text-teacher-700">Add New Student</h1>
      </div>
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
          <CardDescription>
            Add a new student to your records. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter student's full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  name="studentId"
                  placeholder="Enter student ID (optional)"
                  value={formData.studentId}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment">Payment Amount (₹) *</Label>
                <Input
                  id="payment"
                  name="payment"
                  type="number"
                  placeholder="Enter payment amount"
                  value={formData.payment}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("paymentMethod", value)} 
                  value={formData.paymentMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="classType">Class Type *</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("classType", value)} 
                  value={formData.classType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ho'oponopo">Ho'oponopo</SelectItem>
                    <SelectItem value="Astrology">Astrology</SelectItem>
                    <SelectItem value="Pooja">Pooja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="picture">Student Picture</Label>
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <label htmlFor="picture" className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-gray-300 cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-500">Upload Image</span>
                      </div>
                      <input
                        id="picture"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {previewUrl && (
                    <div className="h-32 w-32 relative rounded-md overflow-hidden border border-gray-200">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Enter any additional information about the student"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button">Cancel</Button>
              <Button 
                type="submit" 
                className="bg-teacher-400 hover:bg-teacher-500 text-white" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Student"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddStudent;
