import { Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";

export default function NewExam() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Create New Exam"
        description="Add a new exam to the system"
        actions={
          <div className="flex items-center gap-3">
            <Link to="/admin/exams">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Exam
            </Button>
          </div>
        }
      />

      <div className="p-8 max-w-4xl">
        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Exam Name</Label>
                  <Input id="name" placeholder="Enter exam name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" placeholder="exam-slug" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter exam description..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Exam Details */}
          <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="Select category" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Exam Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Input id="status" placeholder="Select status" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input id="metaTitle" placeholder="Enter meta title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  placeholder="Enter meta description..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
