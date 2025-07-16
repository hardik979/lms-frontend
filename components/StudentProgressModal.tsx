import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BookOpen,
  Clock,
  CheckCircle,
  Circle,
  User,
  PlayCircle,
  BarChart3,
  Target,
  Trophy,
  Star,
  Activity,
} from "lucide-react";

interface Video {
  videoId: string;
  title: string;
  progress: number;
  lastWatchedTime: number;
}

interface Chapter {
  chapterTitle: string;
  videos: Video[];
}

interface Course {
  courseId: string;
  courseTitle: string;
  chapters: Chapter[];
}

interface StudentData {
  name: string;
  email: string;
  purchasedCourses: Course[];
}

interface StudentProgressData {
  student: StudentData;
}

function StudentProgressModal({
  isOpen,
  onClose,
  studentProgress,
  formatTime,
}: {
  isOpen: boolean;
  onClose: () => void;
  studentProgress: StudentProgressData | null;
  formatTime: (seconds: number) => string;
}) {
  if (!isOpen || !studentProgress) return null;

  const { student } = studentProgress;

  // Calculate overall statistics from the API data
  const calculateOverallStats = () => {
    let totalStudyTime = 0;
    let totalVideos = 0;
    let completedVideos = 0;

    student.purchasedCourses.forEach((course) => {
      course.chapters.forEach((chapter) => {
        chapter.videos.forEach((video) => {
          totalVideos++;
          totalStudyTime += video.lastWatchedTime || 0;
          if (video.progress >= 100) {
            completedVideos++;
          }
        });
      });
    });

    const averageProgress =
      totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

    return {
      totalStudyTime,
      totalCourses: student.purchasedCourses.length,
      completedVideos,
      totalVideos,
      averageProgress,
    };
  };

  const overallStats = calculateOverallStats();

  // Transform courses for display
  const transformedCourses = student.purchasedCourses.map((course) => {
    const totalVideos = course.chapters.reduce(
      (sum, chapter) => sum + chapter.videos.length,
      0
    );
    const completedVideos = course.chapters.reduce(
      (sum, chapter) =>
        sum + chapter.videos.filter((video) => video.progress >= 100).length,
      0
    );
    const totalStudyTime = course.chapters.reduce(
      (sum, chapter) =>
        sum +
        chapter.videos.reduce(
          (videoSum, video) => videoSum + (video.lastWatchedTime || 0),
          0
        ),
      0
    );

    // Find last accessed time
    const lastAccessed = course.chapters.reduce((latest, chapter) => {
      const chapterLatest = chapter.videos.reduce((videoLatest, video) => {
        return video.lastWatchedTime > videoLatest
          ? video.lastWatchedTime
          : videoLatest;
      }, 0);
      return chapterLatest > latest ? chapterLatest : latest;
    }, 0);

    return {
      _id: course.courseId,
      title: course.courseTitle,
      description: `${totalVideos} videos across ${course.chapters.length} chapters`,
      completedChapters: completedVideos,
      totalChapters: totalVideos,
      totalStudyTime,
      lastAccessed:
        lastAccessed > 0 ? new Date(lastAccessed * 1000).toISOString() : null,
      chapters: course.chapters.map((chapter) => ({
        _id: chapter.chapterTitle,
        title: chapter.chapterTitle,
        completed: chapter.videos.every((video) => video.progress >= 100),
        completedAt: chapter.videos.some((video) => video.progress >= 100)
          ? new Date(
              Math.max(...chapter.videos.map((v) => v.lastWatchedTime || 0)) *
                1000
            ).toISOString()
          : null,
        studyTime: chapter.videos.reduce(
          (sum, video) => sum + (video.lastWatchedTime || 0),
          0
        ),
        videos: chapter.videos,
      })),
    };
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="bg-gradient-to-br from-cyan-950 to-slate-900 rounded-3xl border border-cyan-800/50 max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-900/60 to-blue-900/60 p-6 border-b border-cyan-800/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-cyan-100">
                    {student?.name || "Student"}'s Progress
                  </h2>
                  <p className="text-cyan-400 text-sm flex items-center space-x-2">
                    <Activity className="w-4 h-4" />
                    <span>Detailed learning analytics</span>
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Overall Stats */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-cyan-100 mb-4 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <span>Overall Statistics</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Study Time"
                  value={formatTime(overallStats.totalStudyTime)}
                  icon={Clock}
                  color="from-blue-500 to-cyan-500"
                />
                <StatCard
                  title="Courses Enrolled"
                  value={overallStats.totalCourses}
                  icon={BookOpen}
                  color="from-green-500 to-emerald-500"
                />
                <StatCard
                  title="Videos Completed"
                  value={`${overallStats.completedVideos}/${overallStats.totalVideos}`}
                  icon={CheckCircle}
                  color="from-purple-500 to-violet-500"
                />
                <StatCard
                  title="Average Progress"
                  value={`${Math.round(overallStats.averageProgress)}%`}
                  icon={Target}
                  color="from-orange-500 to-red-500"
                />
              </div>
            </div>

            {/* Courses Progress */}
            <div>
              <h3 className="text-xl font-bold text-cyan-100 mb-6 flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-cyan-400" />
                <span>Course Progress</span>
              </h3>
              <div className="space-y-6">
                {transformedCourses.map((course, index) => (
                  <CourseProgressCard
                    key={course._id}
                    course={course}
                    index={index}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            </div>

            {/* Empty State */}
            {transformedCourses.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-cyan-100 mb-2">
                  No Course Progress Yet
                </h3>
                <p className="text-cyan-400">
                  This student hasn't started any courses yet.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-cyan-950/40 backdrop-blur-xl rounded-2xl border border-cyan-800/40 p-4 hover:border-cyan-600/60 transition-all duration-300 shadow-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-cyan-100">{value}</div>
        </div>
      </div>
      <h4 className="text-cyan-300 font-medium text-sm">{title}</h4>
    </motion.div>
  );
}

function CourseProgressCard({
  course,
  index,
  formatTime,
}: {
  course: any;
  index: number;
  formatTime: (seconds: number) => string;
}) {
  const progressPercentage =
    Math.round((course.completedChapters / course.totalChapters) * 100) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-cyan-950/40 backdrop-blur-xl rounded-2xl border border-cyan-800/40 p-6 hover:border-cyan-600/60 transition-all duration-300 shadow-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-cyan-100">{course.title}</h4>
            <p className="text-cyan-400 text-sm">{course.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-cyan-100">
            {progressPercentage}%
          </div>
          <div className="text-cyan-400 text-sm">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-cyan-300 text-sm font-medium">Progress</span>
          <span className="text-cyan-400 text-sm">
            {course.completedChapters} / {course.totalChapters} videos
          </span>
        </div>
        <div className="w-full bg-cyan-900/30 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: index * 0.1 }}
            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-3 p-3 bg-cyan-900/20 rounded-xl border border-cyan-800/30">
          <Clock className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="text-cyan-100 font-semibold">
              {formatTime(course.totalStudyTime || 0)}
            </div>
            <div className="text-cyan-400 text-xs">Study Time</div>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-cyan-900/20 rounded-xl border border-cyan-800/30">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <div>
            <div className="text-cyan-100 font-semibold">
              {course.completedChapters}
            </div>
            <div className="text-cyan-400 text-xs">Completed</div>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      {course.chapters && course.chapters.length > 0 && (
        <div>
          <h5 className="text-cyan-200 font-semibold mb-3 flex items-center space-x-2">
            <Star className="w-4 h-4 text-cyan-400" />
            <span>Chapter Progress</span>
          </h5>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {course.chapters.map((chapter: any, chapterIndex: number) => (
              <motion.div
                key={chapter._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + chapterIndex * 0.05 }}
                className="bg-cyan-900/10 rounded-lg border border-cyan-800/20 hover:bg-cyan-900/20 transition-colors"
              >
                <div className="flex items-center space-x-3 p-3">
                  {chapter.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-cyan-200 font-medium truncate">
                      {chapter.title}
                    </div>
                    {chapter.completedAt && (
                      <div className="text-cyan-400 text-xs">
                        Completed:{" "}
                        {new Date(chapter.completedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  {chapter.studyTime && (
                    <div className="text-cyan-400 text-sm flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(chapter.studyTime)}</span>
                    </div>
                  )}
                </div>

                {/* Video Progress */}
                <div className="px-3 pb-3">
                  <div className="space-y-1">
                    {chapter.videos.map((video: Video, videoIndex: number) => (
                      <div
                        key={video.videoId}
                        className="flex items-center space-x-2 p-2 bg-cyan-900/10 rounded text-sm"
                      >
                        <PlayCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-cyan-300 truncate">
                            {video.title}
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-cyan-400">
                            <span>{Math.round(video.progress)}% complete</span>
                            {video.lastWatchedTime > 0 && (
                              <span>
                                • {formatTime(video.lastWatchedTime)} watched
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-16 bg-cyan-900/30 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full"
                            style={{
                              width: `${Math.min(video.progress, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default StudentProgressModal;
