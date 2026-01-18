import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Manga {
  id: number;
  title: string;
  status: 'reading' | 'completed' | 'plan-to-read' | 'dropped';
  chaptersRead: number;
  totalChapters: number;
  rating: number;
  genre: string;
  coverColor: string;
}

const mockMangaData: Manga[] = [
  { id: 1, title: 'One Piece', status: 'reading', chaptersRead: 875, totalChapters: 1100, rating: 5, genre: 'Shonen', coverColor: '#8B5CF6' },
  { id: 2, title: 'Attack on Titan', status: 'completed', chaptersRead: 139, totalChapters: 139, rating: 5, genre: 'Seinen', coverColor: '#000000' },
  { id: 3, title: 'My Hero Academia', status: 'reading', chaptersRead: 320, totalChapters: 410, rating: 4, genre: 'Shonen', coverColor: '#22C55E' },
  { id: 4, title: 'Jujutsu Kaisen', status: 'reading', chaptersRead: 245, totalChapters: 250, rating: 5, genre: 'Shonen', coverColor: '#EF4444' },
  { id: 5, title: 'Chainsaw Man', status: 'completed', chaptersRead: 97, totalChapters: 97, rating: 5, genre: 'Shonen', coverColor: '#F59E0B' },
  { id: 6, title: 'Demon Slayer', status: 'completed', chaptersRead: 205, totalChapters: 205, rating: 4, genre: 'Shonen', coverColor: '#06B6D4' },
  { id: 7, title: 'Berserk', status: 'plan-to-read', chaptersRead: 0, totalChapters: 374, rating: 0, genre: 'Seinen', coverColor: '#64748B' },
  { id: 8, title: 'Vagabond', status: 'plan-to-read', chaptersRead: 0, totalChapters: 327, rating: 0, genre: 'Seinen', coverColor: '#A855F7' },
];

export default function Index() {
  const [mangaList] = useState<Manga[]>(mockMangaData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('library');

  const filteredManga = mangaList.filter(manga => {
    const matchesSearch = manga.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || manga.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalManga: mangaList.length,
    reading: mangaList.filter(m => m.status === 'reading').length,
    completed: mangaList.filter(m => m.status === 'completed').length,
    planToRead: mangaList.filter(m => m.status === 'plan-to-read').length,
    totalChaptersRead: mangaList.reduce((acc, m) => acc + m.chaptersRead, 0),
    averageRating: (mangaList.filter(m => m.rating > 0).reduce((acc, m) => acc + m.rating, 0) / mangaList.filter(m => m.rating > 0).length).toFixed(1),
  };

  const exportToJSON = () => {
    const data = JSON.stringify(mangaList, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'manga-library.json';
    link.click();
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Status', 'Chapters Read', 'Total Chapters', 'Progress %', 'Rating', 'Genre'];
    const rows = mangaList.map(m => [
      m.title,
      m.status,
      m.chaptersRead,
      m.totalChapters,
      ((m.chaptersRead / m.totalChapters) * 100).toFixed(1),
      m.rating || 'N/A',
      m.genre
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'manga-library.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="BookOpen" size={24} className="text-primary" />
              <h1 className="text-2xl font-semibold tracking-tight">Manga Tracker</h1>
            </div>
            <nav className="flex gap-1">
              <Button variant={activeTab === 'library' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('library')}>
                <Icon name="Library" size={16} className="mr-2" />
                Library
              </Button>
              <Button variant={activeTab === 'stats' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('stats')}>
                <Icon name="BarChart3" size={16} className="mr-2" />
                Stats
              </Button>
              <Button variant={activeTab === 'export' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('export')}>
                <Icon name="Download" size={16} className="mr-2" />
                Export
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'library' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search manga..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="plan-to-read">Plan to Read</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredManga.map((manga) => (
                <Card key={manga.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="w-full h-32 rounded-md flex items-center justify-center" style={{ backgroundColor: manga.coverColor }}>
                        <Icon name="BookOpen" size={48} className="text-white/20" />
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-1">{manga.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {manga.status === 'reading' && 'Reading'}
                        {manga.status === 'completed' && 'Completed'}
                        {manga.status === 'plan-to-read' && 'Plan to Read'}
                        {manga.status === 'dropped' && 'Dropped'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{manga.genre}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {manga.chaptersRead}/{manga.totalChapters}
                        </span>
                      </div>
                      <Progress value={(manga.chaptersRead / manga.totalChapters) * 100} className="h-2" />
                    </div>
                    {manga.rating > 0 && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={14}
                            className={i < manga.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredManga.length === 0 && (
              <div className="text-center py-12">
                <Icon name="BookX" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No manga found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Manga</CardDescription>
                  <CardTitle className="text-4xl">{stats.totalManga}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icon name="TrendingUp" size={16} className="mr-1 text-green-500" />
                    In your library
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Currently Reading</CardDescription>
                  <CardTitle className="text-4xl">{stats.reading}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icon name="BookOpen" size={16} className="mr-1 text-primary" />
                    Active series
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Completed</CardDescription>
                  <CardTitle className="text-4xl">{stats.completed}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icon name="CheckCircle2" size={16} className="mr-1 text-green-500" />
                    Finished reading
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Plan to Read</CardDescription>
                  <CardTitle className="text-4xl">{stats.planToRead}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icon name="Clock" size={16} className="mr-1 text-orange-500" />
                    In backlog
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Chapters Read</CardDescription>
                  <CardTitle className="text-4xl">{stats.totalChaptersRead.toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icon name="Zap" size={16} className="mr-1 text-yellow-500" />
                    Across all series
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Average Rating</CardDescription>
                  <CardTitle className="text-4xl flex items-center gap-2">
                    {stats.averageRating}
                    <Icon name="Star" size={24} className="fill-primary text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icon name="Award" size={16} className="mr-1 text-primary" />
                    Your ratings
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Reading Status Distribution</CardTitle>
                <CardDescription>Breakdown of your manga collection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Reading ({stats.reading})</span>
                    <span className="text-muted-foreground">{((stats.reading / stats.totalManga) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(stats.reading / stats.totalManga) * 100} className="h-3" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed ({stats.completed})</span>
                    <span className="text-muted-foreground">{((stats.completed / stats.totalManga) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(stats.completed / stats.totalManga) * 100} className="h-3" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Plan to Read ({stats.planToRead})</span>
                    <span className="text-muted-foreground">{((stats.planToRead / stats.totalManga) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(stats.planToRead / stats.totalManga) * 100} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Your Library</CardTitle>
                <CardDescription>
                  Download your manga collection and reading statistics in various formats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon name="FileJson" size={24} className="text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">JSON Format</CardTitle>
                          <CardDescription className="text-sm">
                            Complete data with all fields and metadata
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={exportToJSON} className="w-full">
                        <Icon name="Download" size={16} className="mr-2" />
                        Export as JSON
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon name="FileSpreadsheet" size={24} className="text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">CSV Format</CardTitle>
                          <CardDescription className="text-sm">
                            Spreadsheet-compatible format for Excel, Sheets
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={exportToCSV} className="w-full">
                        <Icon name="Download" size={16} className="mr-2" />
                        Export as CSV
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Icon name="Info" size={16} className="text-muted-foreground" />
                    Export Information
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="mt-0.5 text-primary flex-shrink-0" />
                      <span>Includes all manga in your library ({stats.totalManga} titles)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="mt-0.5 text-primary flex-shrink-0" />
                      <span>Contains reading progress and ratings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="mt-0.5 text-primary flex-shrink-0" />
                      <span>Total chapters tracked: {stats.totalChaptersRead.toLocaleString()}</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}