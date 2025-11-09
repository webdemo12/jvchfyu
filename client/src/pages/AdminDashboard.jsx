import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut,
  Plus,
  Trash2,
  Edit,
  Key,
  Mail,
  Calendar,
  Clock,
  Hash,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [newResult, setNewResult] = useState({
    date: new Date().toLocaleDateString('en-GB'),
    time: "",
    number: "",
    bottomNumber: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Check if authenticated
  const { data: adminData, isLoading: isCheckingAuth } = useQuery({
    queryKey: ["/api/admin/me"],
    queryFn: api.getMe,
    retry: false,
    onError: () => {
      setLocation("/admin");
    },
  });

  // Get all results for management
  const { data: allResults = {}, isLoading: isLoadingResults } = useQuery({
    queryKey: ["/api/results/all"],
    queryFn: () => api.getAllResults(100),
  });

  // Get contact submissions
  const { data: contacts = [], isLoading: isLoadingContacts, error: contactsError } = useQuery({
    queryKey: ["/api/admin/contacts"],
    queryFn: api.getContacts,
    retry: false,
    enabled: !!adminData, // Only fetch if authenticated
  });

  const logoutMutation = useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      queryClient.clear();
      setLocation("/admin");
      toast({ title: "Logged out successfully" });
    },
  });

  const createResultMutation = useMutation({
    mutationFn: (data) => api.createResult(data.date, data.time, data.number, data.bottomNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/results/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/results/today"] });
      setShowAddDialog(false);
      setNewResult({ date: new Date().toLocaleDateString('en-GB'), time: "", number: "", bottomNumber: "" });
      toast({ title: "Result added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateResultMutation = useMutation({
    mutationFn: ({ id, updates }) => api.updateResult(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/results/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/results/today"] });
      setShowEditDialog(false);
      setEditingResult(null);
      toast({ title: "Result updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteResultMutation = useMutation({
    mutationFn: (id) => api.deleteResult(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/results/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/results/today"] });
      toast({ title: "Result deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }) =>
      api.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      setShowPasswordDialog(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({ title: "Password changed successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleAddResult = () => {
    if (!newResult.time || !newResult.number) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    createResultMutation.mutate(newResult);
  };

  const handleEditResult = () => {
    if (!editingResult) return;
    updateResultMutation.mutate({
      id: editingResult.id,
      updates: {
        date: editingResult.date,
        time: editingResult.time,
        number: editingResult.number,
        bottomNumber: editingResult.bottomNumber,
      },
    });
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: "Error", description: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Flatten results for table display
  const flatResults = [];
  Object.entries(allResults).forEach(([date, results]) => {
    results.forEach(result => {
      flatResults.push(result);
    });
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl"></div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm opacity-90">Welcome, {adminData?.admin?.username}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => setShowPasswordDialog(true)}
                data-testid="button-change-password"
              >
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => logoutMutation.mutate()}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Results Management */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-2xl font-bold">Game Results Management</h2>
            <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-result">
              <Plus className="h-4 w-4 mr-2" />
              Add Result
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingResults ? (
              <div className="text-center py-8">Loading results...</div>
            ) : flatResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No results yet. Add your first result.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Date</th>
                      <th className="text-left p-3 font-semibold">Time</th>
                      <th className="text-left p-3 font-semibold">Number</th>
                      <th className="text-right p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flatResults.map((result) => (
                      <tr key={result.id} className="border-b hover-elevate" data-testid={`row-result-${result.id}`}>
                        <td className="p-3">{result.date}</td>
                        <td className="p-3">{result.time}</td>
                        <td className="p-3">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xl font-mono font-bold text-primary">
                              {result.number}
                            </span>
                            {result.bottomNumber && (
                              <span className="text-lg font-mono font-bold text-primary/80">
                                {result.bottomNumber}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingResult(result);
                              setShowEditDialog(true);
                            }}
                            data-testid={`button-edit-${result.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this result?")) {
                                deleteResultMutation.mutate(result.id);
                              }
                            }}
                            data-testid={`button-delete-${result.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Submissions */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Contact Submissions</h2>
          </CardHeader>
          <CardContent>
            {isLoadingContacts ? (
              <div className="text-center py-8">Loading contacts...</div>
            ) : contactsError ? (
              <div className="text-center py-8 text-destructive">
                Failed to load contacts. Please try refreshing the page.
              </div>
            ) : !Array.isArray(contacts) ? (
              <div className="text-center py-8 text-muted-foreground">
                Invalid contacts data format.
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No contact submissions yet.
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <Card key={contact.id} className="hover-elevate" data-testid={`contact-${contact.id}`}>
                    <CardContent className="pt-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Name</p>
                          <p className="font-semibold">{contact.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Phone</p>
                          <p className="font-semibold">{contact.phone}</p>
                        </div>
                        {contact.email && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Email</p>
                            <p className="font-semibold">{contact.email}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                          <p className="font-semibold">
                            {new Date(contact.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-muted-foreground mb-1">Message</p>
                          <p className="bg-muted/30 p-3 rounded-md">{contact.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Result Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Result</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="inline h-4 w-4 mr-1" /> Date
              </label>
              <Input
                type="date"
                value={newResult.date.split('/').reverse().join('-')}
                onChange={(e) => {
                  const val = e.target.value;
                  const formatted = val.split('-').reverse().join('/');
                  setNewResult({ ...newResult, date: formatted });
                }}
                data-testid="input-add-date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <Clock className="inline h-4 w-4 mr-1" /> Time
              </label>
              <Input
                placeholder="e.g., 10:30 AM"
                value={newResult.time}
                onChange={(e) => setNewResult({ ...newResult, time: e.target.value })}
                data-testid="input-add-time"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <Hash className="inline h-4 w-4 mr-1" /> Pati Number
              </label>
              <Input
                placeholder="e.g., 268"
                value={newResult.number}
                onChange={(e) => setNewResult({ ...newResult, number: e.target.value })}
                data-testid="input-add-number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <Hash className="inline h-4 w-4 mr-1" /> Ghar number
              </label>
              <Input
                placeholder="e.g., 123"
                value={newResult.bottomNumber}
                onChange={(e) => setNewResult({ ...newResult, bottomNumber: e.target.value })}
                data-testid="input-add-bottom-number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddResult}
              disabled={createResultMutation.isPending}
              data-testid="button-submit-add"
            >
              {createResultMutation.isPending ? "Adding..." : "Add Result"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Result Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Result</DialogTitle>
          </DialogHeader>
          {editingResult && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" /> Date
                </label>
                <Input
                  type="date"
                  value={editingResult.date.split('/').reverse().join('-')}
                  onChange={(e) => {
                    const val = e.target.value;
                    const formatted = val.split('-').reverse().join('/');
                    setEditingResult({ ...editingResult, date: formatted });
                  }}
                  data-testid="input-edit-date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Clock className="inline h-4 w-4 mr-1" /> Time
                </label>
                <Input
                  value={editingResult.time}
                  onChange={(e) => setEditingResult({ ...editingResult, time: e.target.value })}
                  data-testid="input-edit-time"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Hash className="inline h-4 w-4 mr-1" /> Result Number
                </label>
                <Input
                  value={editingResult.number}
                  onChange={(e) => setEditingResult({ ...editingResult, number: e.target.value })}
                  data-testid="input-edit-number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Hash className="inline h-4 w-4 mr-1" /> Bottom Number (Optional)
                </label>
                <Input
                  value={editingResult.bottomNumber || ""}
                  onChange={(e) => setEditingResult({ ...editingResult, bottomNumber: e.target.value })}
                  data-testid="input-edit-bottom-number"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditResult}
              disabled={updateResultMutation.isPending}
              data-testid="button-submit-edit"
            >
              {updateResultMutation.isPending ? "Updating..." : "Update Result"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                data-testid="input-current-password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                data-testid="input-new-password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                data-testid="input-confirm-password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={changePasswordMutation.isPending}
              data-testid="button-submit-password"
            >
              {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
