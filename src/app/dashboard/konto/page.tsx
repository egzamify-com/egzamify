"use client";

import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Lightbulb,
  Loader2,
  Settings,
  Target,
  TrendingUp,
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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";

export default function StatisticsPage() {
  const user = useQuery(api.users.query.getCurrentUser);
  const userStats = useQuery(api.statistics.query.getUserStatistics);
  const weeklyProgress = useQuery(api.statistics.query.getWeeklyProgress);
  const qualificationStats = useQuery(
    api.statistics.query.getQualificationStats,
  );
  const monthlyTrend = useQuery(api.statistics.query.getMonthlyTrends);
  const studyPatterns = useQuery(api.statistics.query.getStudyPatterns);
  const skillRadar = useQuery(api.statistics.query.getSkillRadar);
  const difficultyBreakdown = useQuery(
    api.statistics.query.getDifficultyBreakdown,
  );

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (
    user === undefined ||
    userStats === undefined ||
    weeklyProgress === undefined ||
    qualificationStats === undefined ||
    monthlyTrend === undefined ||
    studyPatterns === undefined ||
    skillRadar === undefined ||
    difficultyBreakdown === undefined
  ) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) return redirect("/sign-in");

  return (
    <div className="space-y-6 px-10 pt-10 pb-16">
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

      {userStats ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="w-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Rozwiązane pytania
                    </p>
                    <p className="text-2xl font-bold">
                      {userStats.totalQuestions.toLocaleString()}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Skuteczność
                    </p>
                    <p className="text-2xl font-bold">
                      {userStats.averageAccuracy}%
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Czas nauki
                    </p>
                    <p className="text-2xl font-bold">
                      {formatTime(userStats.totalStudyTime)}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="w-full">
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

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="w-full">
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

            <Card className="w-full">
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

          <Card className="w-full">
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
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="w-full">
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">Osiągnięcia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Wyjaśnienia AI</span>
                  <span className="font-bold">
                    {userStats.aiExplanationsUsed}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">Postęp do celu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Skuteczność 80%</span>
                    <span>{userStats.averageAccuracy}%</span>
                  </div>
                  <Progress value={userStats.averageAccuracy} className="h-2" />
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>1000 pytań</span>
                    <span>{userStats.totalQuestions}</span>
                  </div>
                  <Progress
                    value={(userStats.totalQuestions / 1000) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">Aktywność</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Poprawne odpowiedzi</p>
                    <p className="text-xs text-gray-600">
                      {userStats.correctAnswers}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Błędne odpowiedzi</p>
                    <p className="text-xs text-gray-600">
                      {userStats.totalQuestions - userStats.correctAnswers}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Użyte wyjaśnienia</p>
                    <p className="text-xs text-gray-600">
                      {userStats.aiExplanationsUsed}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="w-full">
          <CardContent className="py-12 text-center">
            <p className="text-lg text-gray-500">
              Brak danych statystycznych. Zacznij rozwiązywać pytania!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
