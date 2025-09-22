"use client";

import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Award,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Flame,
  Lightbulb,
  Loader2,
  Settings,
  Target,
  TrendingUp,
  Trophy,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";

// Mock data
const mockUserStats = {
  totalQuestions: 1247,
  correctAnswers: 892,
  currentStreak: 15,
  bestStreak: 42,
  totalStudyTime: 2847, // minutes
  averageAccuracy: 71.5,
  aiExplanationsUsed: 234,
  qualificationsStarted: 5,
  qualificationsCompleted: 2,
};

const weeklyProgress = [
  { day: "Pon", questions: 12, correct: 9, time: 45 },
  { day: "Wt", questions: 18, correct: 14, time: 67 },
  { day: "Śr", questions: 15, correct: 11, time: 52 },
  { day: "Czw", questions: 22, correct: 17, time: 78 },
  { day: "Pt", questions: 19, correct: 15, time: 63 },
  { day: "Sob", questions: 25, correct: 20, time: 89 },
  { day: "Nie", questions: 16, correct: 13, time: 58 },
];

const qualificationStats = [
  {
    name: "INF.02",
    completed: 145,
    correct: 108,
    accuracy: 74.5,
    color: "#8884d8",
  },
  {
    name: "INF.03",
    completed: 89,
    correct: 67,
    accuracy: 75.3,
    color: "#82ca9d",
  },
  {
    name: "INF.04",
    completed: 67,
    correct: 45,
    accuracy: 67.2,
    color: "#ffc658",
  },
  {
    name: "E.12",
    completed: 34,
    correct: 28,
    accuracy: 82.4,
    color: "#ff7300",
  },
  {
    name: "E.13",
    completed: 23,
    correct: 18,
    accuracy: 78.3,
    color: "#00ff88",
  },
];

const monthlyTrend = [
  { month: "Sty", questions: 89, accuracy: 68.5, streak: 8 },
  { month: "Lut", questions: 124, accuracy: 71.2, streak: 12 },
  { month: "Mar", questions: 156, accuracy: 73.8, streak: 18 },
  { month: "Kwi", questions: 198, accuracy: 75.1, streak: 25 },
  { month: "Maj", questions: 234, accuracy: 76.9, streak: 31 },
  { month: "Cze", questions: 267, accuracy: 78.2, streak: 42 },
];

const difficultyBreakdown = [
  { name: "Łatwe", value: 45, color: "#00C49F" },
  { name: "Średnie", value: 35, color: "#FFBB28" },
  { name: "Trudne", value: 20, color: "#FF8042" },
];

const studyPatterns = [
  { time: "6:00", sessions: 2 },
  { time: "8:00", sessions: 8 },
  { time: "10:00", sessions: 15 },
  { time: "12:00", sessions: 12 },
  { time: "14:00", sessions: 18 },
  { time: "16:00", sessions: 25 },
  { time: "18:00", sessions: 32 },
  { time: "20:00", sessions: 28 },
  { time: "22:00", sessions: 15 },
];

const skillRadar = [
  { skill: "Sieci", current: 78, target: 90 },
  { skill: "Programowanie", current: 85, target: 95 },
  { skill: "Bazy danych", current: 72, target: 85 },
  { skill: "Systemy", current: 68, target: 80 },
  { skill: "Bezpieczeństwo", current: 75, target: 88 },
  { skill: "Web dev", current: 82, target: 92 },
];

export default function StatisticsPage() {
  const user = useQuery(api.users.query.getCurrentUser);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (user === undefined) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) return redirect("/sign-in");

  return (
    <div className="space-y-6 px-10 pt-10">
      {/* User Profile Card */}
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-600">
              <span className="text-lg font-medium text-white">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-muted-foreground mt-1">{user.email}</p>
            </div>

            <Link href={`/user/${user.username}`}>
              <Button variant={"outline"}>
                <User className="mr-2 h-4 w-4" /> Public profile
              </Button>
            </Link>
            <Link href={"/dashboard/settings"}>
              <Button variant={"outline"}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="container mx-auto space-y-8 px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Statystyki nauki</h1>
          <p className="text-gray-600">
            Kompleksowy przegląd Twojego postępu i osiągnięć
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Rozwiązane pytania
                  </p>
                  <p className="text-2xl font-bold">
                    {mockUserStats.totalQuestions.toLocaleString()}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Skuteczność
                  </p>
                  <p className="text-2xl font-bold">
                    {mockUserStats.averageAccuracy}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Aktualna seria
                  </p>
                  <p className="flex items-center gap-2 text-2xl font-bold">
                    {mockUserStats.currentStreak}
                    <Flame className="h-6 w-6 text-orange-500" />
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Czas nauki
                  </p>
                  <p className="text-2xl font-bold">
                    {formatTime(mockUserStats.totalStudyTime)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Postęp w tym tygodniu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="questions"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
                <Area
                  type="monotone"
                  dataKey="correct"
                  stackId="2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Qualification Performance */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Wyniki per kwalifikacja
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={qualificationStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="accuracy" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Rozkład trudności pytań
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={difficultyBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {difficultyBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Trendy miesięczne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="questions"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="streak"
                  stroke="#ffc658"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Study Patterns & Skills */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Wzorce nauki (godziny)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={studyPatterns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="sessions"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Mapa umiejętności
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Aktualny"
                    dataKey="current"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Cel"
                    dataKey="target"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Osiągnięcia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Najlepsza seria</span>
                <Badge variant="secondary">{mockUserStats.bestStreak} 🔥</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Ukończone kwalifikacje</span>
                <Badge variant="secondary">
                  {mockUserStats.qualificationsCompleted}/5
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Wyjaśnienia AI</span>
                <Badge variant="secondary">
                  {mockUserStats.aiExplanationsUsed}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Postęp do celu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Skuteczność 80%</span>
                  <span>{mockUserStats.averageAccuracy}%</span>
                </div>
                <Progress
                  value={mockUserStats.averageAccuracy}
                  className="h-2"
                />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>1000 pytań</span>
                  <span>{mockUserStats.totalQuestions}</span>
                </div>
                <Progress
                  value={(mockUserStats.totalQuestions / 1000) * 100}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aktywność</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Poprawne odpowiedzi</p>
                  <p className="text-xs text-gray-600">
                    {mockUserStats.correctAnswers}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Błędne odpowiedzi</p>
                  <p className="text-xs text-gray-600">
                    {mockUserStats.totalQuestions -
                      mockUserStats.correctAnswers}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Lightbulb className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Użyte wyjaśnienia</p>
                  <p className="text-xs text-gray-600">
                    {mockUserStats.aiExplanationsUsed}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
