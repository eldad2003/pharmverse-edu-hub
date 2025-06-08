
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Upload, Video, Users, Clock, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  username: string;
  yearGroup: string;
  role: 'admin' | 'student';
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [timetableEntry, setTimetableEntry] = useState({
    day: '',
    time: '',
    subject: '',
    instructor: '',
    location: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const handleTimetableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const existingTimetable = JSON.parse(localStorage.getItem(`timetable_${user.yearGroup}`) || '[]');
    existingTimetable.push({ ...timetableEntry, id: Date.now() });
    localStorage.setItem(`timetable_${user.yearGroup}`, JSON.stringify(existingTimetable));
    
    toast({
      title: "Timetable Updated",
      description: "New class has been added to the timetable",
    });
    
    setTimetableEntry({ day: '', time: '', subject: '', instructor: '', location: '' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setUploadedFiles([...uploadedFiles, ...fileNames]);
      
      // Store in localStorage (in real app, would upload to server)
      const existingFiles = JSON.parse(localStorage.getItem(`files_${user.yearGroup}`) || '[]');
      const newFiles = fileNames.map(name => ({ name, uploadDate: new Date().toISOString() }));
      localStorage.setItem(`files_${user.yearGroup}`, JSON.stringify([...existingFiles, ...newFiles]));
      
      toast({
        title: "Files Uploaded",
        description: `${fileNames.length} file(s) uploaded successfully`,
      });
    }
  };

  const startConference = () => {
    toast({
      title: "Conference Starting",
      description: "Video conference link has been generated for your year group",
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full pharm-gradient flex items-center justify-center animate-glow">
              <span className="text-xl font-bold text-white">Rx</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-pharm-blue-800">Admin Dashboard</h1>
              <p className="text-pharm-blue-600">Managing {user.yearGroup}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="pharm-gradient text-white px-3 py-1">
              {user.username} - {user.yearGroup}
            </Badge>
            <Button onClick={onLogout} variant="outline" className="neomorphic">
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card neomorphic hover:animate-float transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Users className="h-8 w-8 text-pharm-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="text-2xl font-bold text-pharm-blue-800">24</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neomorphic hover:animate-float transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <BookOpen className="h-8 w-8 text-pharm-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Materials</p>
                  <p className="text-2xl font-bold text-pharm-blue-800">{uploadedFiles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neomorphic hover:animate-float transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Clock className="h-8 w-8 text-pharm-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Classes Today</p>
                  <p className="text-2xl font-bold text-pharm-blue-800">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neomorphic hover:animate-float transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Video className="h-8 w-8 text-pharm-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Live Sessions</p>
                  <p className="text-2xl font-bold text-pharm-blue-800">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="glass-card neomorphic">
          <CardHeader>
            <CardTitle className="text-2xl text-pharm-blue-800">Admin Tools</CardTitle>
            <CardDescription>Manage your year group's educational resources</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="timetable" className="w-full">
              <TabsList className="grid w-full grid-cols-3 neomorphic">
                <TabsTrigger value="timetable" className="data-[state=active]:pharm-gradient data-[state=active]:text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Timetable
                </TabsTrigger>
                <TabsTrigger value="materials" className="data-[state=active]:pharm-gradient data-[state=active]:text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  Materials
                </TabsTrigger>
                <TabsTrigger value="conference" className="data-[state=active]:pharm-gradient data-[state=active]:text-white">
                  <Video className="w-4 h-4 mr-2" />
                  Conference
                </TabsTrigger>
              </TabsList>

              <TabsContent value="timetable" className="mt-6">
                <Card className="neomorphic">
                  <CardHeader>
                    <CardTitle>Add Class to Timetable</CardTitle>
                    <CardDescription>Schedule a new class for {user.yearGroup}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleTimetableSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="day">Day</Label>
                          <Input
                            id="day"
                            value={timetableEntry.day}
                            onChange={(e) => setTimetableEntry({...timetableEntry, day: e.target.value})}
                            placeholder="e.g., Monday"
                            className="neomorphic-inset"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            value={timetableEntry.time}
                            onChange={(e) => setTimetableEntry({...timetableEntry, time: e.target.value})}
                            placeholder="e.g., 09:00 - 10:30"
                            className="neomorphic-inset"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            value={timetableEntry.subject}
                            onChange={(e) => setTimetableEntry({...timetableEntry, subject: e.target.value})}
                            placeholder="e.g., Pharmacology"
                            className="neomorphic-inset"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="instructor">Instructor</Label>
                          <Input
                            id="instructor"
                            value={timetableEntry.instructor}
                            onChange={(e) => setTimetableEntry({...timetableEntry, instructor: e.target.value})}
                            placeholder="e.g., Dr. Smith"
                            className="neomorphic-inset"
                            required
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={timetableEntry.location}
                            onChange={(e) => setTimetableEntry({...timetableEntry, location: e.target.value})}
                            placeholder="e.g., Lecture Hall A"
                            className="neomorphic-inset"
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="pharm-gradient pharm-gradient-hover text-white neomorphic">
                        Add to Timetable
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="materials" className="mt-6">
                <Card className="neomorphic">
                  <CardHeader>
                    <CardTitle>Upload Study Materials</CardTitle>
                    <CardDescription>Share resources with {user.yearGroup} students</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="files">Select Files (PDF, DOCX, PPTX)</Label>
                      <Input
                        id="files"
                        type="file"
                        multiple
                        accept=".pdf,.docx,.pptx"
                        onChange={handleFileUpload}
                        className="neomorphic-inset"
                      />
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <Label>Uploaded Files:</Label>
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <Badge key={index} variant="secondary" className="mr-2">
                              {file}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="conference" className="mt-6">
                <Card className="neomorphic">
                  <CardHeader>
                    <CardTitle>Video Conference</CardTitle>
                    <CardDescription>Host live sessions for {user.yearGroup}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-8 border-2 border-dashed border-pharm-blue-300 rounded-lg neomorphic-inset">
                      <Video className="h-16 w-16 text-pharm-blue-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-pharm-blue-800 mb-2">Start Live Conference</h3>
                      <p className="text-muted-foreground mb-4">Create a video conference for your students</p>
                      <Button onClick={startConference} className="pharm-gradient pharm-gradient-hover text-white neomorphic">
                        Start Conference
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
