
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Video, BookOpen, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  username: string;
  yearGroup: string;
  role: 'admin' | 'student';
}

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

interface TimetableEntry {
  id: number;
  day: string;
  time: string;
  subject: string;
  instructor: string;
  location: string;
}

interface FileEntry {
  name: string;
  uploadDate: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load timetable for the student's year group
    const storedTimetable = JSON.parse(localStorage.getItem(`timetable_${user.yearGroup}`) || '[]');
    setTimetable(storedTimetable);

    // Load files for the student's year group
    const storedFiles = JSON.parse(localStorage.getItem(`files_${user.yearGroup}`) || '[]');
    setFiles(storedFiles);
  }, [user.yearGroup]);

  const joinConference = () => {
    toast({
      title: "Joining Conference",
      description: "Connecting you to the live session...",
    });
  };

  const downloadFile = (fileName: string) => {
    toast({
      title: "Downloading",
      description: `Downloading ${fileName}...`,
    });
  };

  const getCurrentDayClasses = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return timetable.filter(entry => entry.day.toLowerCase() === today.toLowerCase());
  };

  const todayClasses = getCurrentDayClasses();

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
              <h1 className="text-3xl font-bold text-pharm-blue-800">Student Portal</h1>
              <p className="text-pharm-blue-600">Welcome back, {user.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="pharm-gradient text-white px-3 py-1">
              {user.yearGroup}
            </Badge>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
            <Button onClick={onLogout} variant="outline" className="neomorphic">
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card neomorphic hover:animate-float transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Clock className="h-8 w-8 text-pharm-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Today's Classes</p>
                  <p className="text-2xl font-bold text-pharm-blue-800">{todayClasses.length}</p>
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
                  <p className="text-2xl font-bold text-pharm-blue-800">{files.length}</p>
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

          <Card className="glass-card neomorphic hover:animate-float transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <User className="h-8 w-8 text-pharm-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Year Group</p>
                  <p className="text-2xl font-bold text-pharm-blue-800">{user.yearGroup}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Classes Alert */}
        {todayClasses.length > 0 && (
          <Card className="glass-card neomorphic mb-8 border-l-4 border-l-pharm-blue-500">
            <CardHeader>
              <CardTitle className="text-pharm-blue-800 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todayClasses.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 neomorphic-inset rounded-lg">
                    <div>
                      <p className="font-semibold text-pharm-blue-800">{entry.subject}</p>
                      <p className="text-sm text-muted-foreground">{entry.instructor} • {entry.location}</p>
                    </div>
                    <Badge variant="outline">{entry.time}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Card className="glass-card neomorphic">
          <CardHeader>
            <CardTitle className="text-2xl text-pharm-blue-800">Your Dashboard</CardTitle>
            <CardDescription>Access your educational resources and tools</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="timetable" className="w-full">
              <TabsList className="grid w-full grid-cols-3 neomorphic">
                <TabsTrigger value="timetable" className="data-[state=active]:pharm-gradient data-[state=active]:text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Timetable
                </TabsTrigger>
                <TabsTrigger value="materials" className="data-[state=active]:pharm-gradient data-[state=active]:text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Materials
                </TabsTrigger>
                <TabsTrigger value="conference" className="data-[state=active]:pharm-gradient data-[state=active]:text-white">
                  <Video className="w-4 h-4 mr-2" />
                  Live Session
                </TabsTrigger>
              </TabsList>

              <TabsContent value="timetable" className="mt-6">
                <Card className="neomorphic">
                  <CardHeader>
                    <CardTitle>Weekly Timetable</CardTitle>
                    <CardDescription>Your class schedule for {user.yearGroup}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {timetable.length > 0 ? (
                      <div className="space-y-4">
                        {timetable.map((entry) => (
                          <div key={entry.id} className="p-4 neomorphic-inset rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                  <Badge className="pharm-gradient text-white">{entry.day}</Badge>
                                  <span className="font-semibold text-pharm-blue-800">{entry.subject}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {entry.instructor} • {entry.location} • {entry.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-8 neomorphic-inset rounded-lg">
                        <Calendar className="h-16 w-16 text-pharm-blue-500 mx-auto mb-4" />
                        <p className="text-muted-foreground">No classes scheduled yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="materials" className="mt-6">
                <Card className="neomorphic">
                  <CardHeader>
                    <CardTitle>Study Materials</CardTitle>
                    <CardDescription>Download resources for {user.yearGroup}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {files.length > 0 ? (
                      <div className="space-y-4">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-4 neomorphic-inset rounded-lg">
                            <div className="flex items-center space-x-4">
                              <BookOpen className="h-8 w-8 text-pharm-blue-500" />
                              <div>
                                <p className="font-semibold text-pharm-blue-800">{file.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Uploaded: {new Date(file.uploadDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button 
                              onClick={() => downloadFile(file.name)}
                              variant="outline" 
                              className="neomorphic"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-8 neomorphic-inset rounded-lg">
                        <BookOpen className="h-16 w-16 text-pharm-blue-500 mx-auto mb-4" />
                        <p className="text-muted-foreground">No study materials available yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="conference" className="mt-6">
                <Card className="neomorphic">
                  <CardHeader>
                    <CardTitle>Live Conference</CardTitle>
                    <CardDescription>Join video sessions for {user.yearGroup}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-8 border-2 border-dashed border-pharm-blue-300 rounded-lg neomorphic-inset">
                      <Video className="h-16 w-16 text-pharm-blue-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-pharm-blue-800 mb-2">Join Live Session</h3>
                      <p className="text-muted-foreground mb-4">Connect with your classmates and instructor</p>
                      <Button onClick={joinConference} className="pharm-gradient pharm-gradient-hover text-white neomorphic">
                        Join Conference
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

export default StudentDashboard;
