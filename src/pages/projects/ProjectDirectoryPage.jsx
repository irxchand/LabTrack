import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import {
  FolderGit2,
  Users,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
  Layers,
  Plus,
  X,
  UserPlus,
  AlertCircle,
} from 'lucide-react';

export function ProjectDirectoryPage() {
  const navigate = useNavigate();
  const { projects, inventory, createProject } = useLabData();
  const { currentUser, role } = useAuth();
  const isStudent = !role || role === 'Student';
  const userPrn = currentUser?.prn || '202401048';

  const [activeFilter, setActiveFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Group creation form state
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('DCDS-SY-AIML');
  const [mentorName, setMentorName] = useState('Dr. Meenakshi Sharma');
  const [abstract, setAbstract] = useState('');
  const [friends, setFriends] = useState([]);
  const [friendName, setFriendName] = useState('');
  const [friendPrn, setFriendPrn] = useState('');
  const [friendRole, setFriendRole] = useState('');
  const [formError, setFormError] = useState('');

  // Resolve authentic hardware photography
  const getItemImage = (item) => {
    if (!item) return '/images/hardware/raspberry-pi-5.jpg';
    if (item.image) return item.image;

    const match = inventory?.find(
      (i) =>
        i.id === item.assetTag ||
        i.assetTag === item.assetTag ||
        i.id === item.itemId ||
        (i.nomenclature && item.nomenclature && (
          i.nomenclature.toLowerCase().includes(item.nomenclature.toLowerCase()) ||
          item.nomenclature.toLowerCase().includes(i.nomenclature.toLowerCase())
        ))
    );
    if (match?.image) return match.image;

    const nom = item.nomenclature?.toLowerCase() || '';
    if (nom.includes('oled') || nom.includes('display')) return '/images/hardware/oled-display.jpg';
    if (nom.includes('jetson') || nom.includes('orin') || nom.includes('nano')) return '/images/hardware/jetson-nano.jpg';
    if (nom.includes('arduino') || nom.includes('uno')) return '/images/hardware/arduino-uno-r3.jpg';
    if (nom.includes('esp32') || nom.includes('micro') || nom.includes('wroom')) return '/images/hardware/esp32-wroom.jpg';
    if (nom.includes('oscilloscope') || nom.includes('rigol')) return '/images/hardware/oscilloscope.jpg';
    if (nom.includes('jumper') || nom.includes('wire') || nom.includes('ribbon')) return '/images/hardware/jumper-wires.jpg';
    if (nom.includes('breadboard')) return '/images/hardware/breadboard-830.jpg';
    if (nom.includes('mpu') || nom.includes('imu') || nom.includes('gyro') || nom.includes('accelerometer')) return '/images/hardware/mpu6050-sensor.jpg';
    if (nom.includes('sensor') || nom.includes('bmp')) return '/images/hardware/bmp280-sensor.jpg';
    if (nom.includes('resistor')) return '/images/hardware/resistors-pack.jpg';
    return '/images/hardware/raspberry-pi-5.jpg';
  };

  const isUserLead = (project) => {
    return project.teamLeaderPrn === userPrn;
  };

  const isUserMember = (project) => {
    return project.members?.some((m) => m.prn === userPrn) && project.teamLeaderPrn !== userPrn;
  };

  const isUserProject = (project) => {
    return (
      project.teamLeaderPrn === userPrn ||
      project.members?.some((m) => m.prn === userPrn) ||
      project.id === currentUser?.projectId
    );
  };

  // Student portal privacy: Students can ONLY view projects they lead or work in!
  const visibleProjectsPool = useMemo(() => {
    if (isStudent) {
      return projects.filter(isUserProject);
    }
    return projects;
  }, [projects, isStudent, userPrn, currentUser?.projectId]);

  const counts = useMemo(() => {
    if (isStudent) {
      return {
        all: visibleProjectsPool.length,
        leading: visibleProjectsPool.filter(isUserLead).length,
        collaborating: visibleProjectsPool.filter(isUserMember).length,
      };
    }
    return {
      all: projects.length,
      myTeam: projects.filter(isUserProject).length,
      aiml: projects.filter((p) => p.department?.includes('AIML') || p.courseCode?.includes('AIML')).length,
    };
  }, [visibleProjectsPool, projects, isStudent, userPrn]);

  const filteredProjects = useMemo(() => {
    if (isStudent) {
      if (activeFilter === 'leading') {
        return visibleProjectsPool.filter(isUserLead);
      }
      if (activeFilter === 'collaborating') {
        return visibleProjectsPool.filter(isUserMember);
      }
      return visibleProjectsPool;
    }
    if (activeFilter === 'myTeam') {
      return projects.filter(isUserProject);
    }
    if (activeFilter === 'aiml') {
      return projects.filter((p) => p.department?.includes('AIML') || p.courseCode?.includes('AIML'));
    }
    return projects;
  }, [visibleProjectsPool, projects, activeFilter, isStudent, userPrn]);

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (!friendName.trim() || !friendPrn.trim()) {
      setFormError('Please enter both friend name and PRN number.');
      return;
    }
    if (friends.some((f) => f.prn === friendPrn.trim())) {
      setFormError('Friend with this PRN is already added to the roster.');
      return;
    }
    setFriends((prev) => [
      ...prev,
      {
        name: friendName.trim(),
        prn: friendPrn.trim(),
        role: friendRole.trim() || 'Co-Developer',
      },
    ]);
    setFriendName('');
    setFriendPrn('');
    setFriendRole('');
    setFormError('');
  };

  const handleRemoveFriend = (prn) => {
    setFriends((prev) => prev.filter((f) => f.prn !== prn));
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please provide a project group name.');
      return;
    }
    setFormError('');

    const leaderMember = {
      name: currentUser?.name || 'Rahul Sharma',
      prn: currentUser?.prn || '202401048',
      role: 'Team Lead',
    };

    const newProject = await createProject({
      title: title.trim(),
      courseCode,
      mentorName,
      mentorId: mentorName.includes('Meenakshi') ? 'T100458' : mentorName.includes('Manoj') ? 'T100460' : mentorName.includes('Sumit') ? 'T100101' : 'T100455',
      teamLeaderPrn: currentUser?.prn || '202401048',
      members: [leaderMember, ...friends],
      abstract: abstract.trim() || 'Collegiate project hardware development and bench evaluation.',
      hardwareBudgetCap: 3,
    });

    if (newProject) {
      setTitle('');
      setAbstract('');
      setFriends([]);
      setIsModalOpen(false);
      setActiveFilter('all');
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="text-[11px] font-sans font-semibold text-[#c9b8a0] tracking-wider uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0]" />
            STUDENT ACADEMIC PORTAL • COLLABORATIVE HARDWARE POOLS
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1.5">
            My Academic Projects
          </h1>
          <p className="text-sm font-sans text-zinc-400 mt-1 max-w-xl">
            Active capstone research teams, mentor bindings, and authorized hardware quota allocations for your credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] hover:opacity-95 text-black font-semibold text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(201,184,160,0.3)] flex items-center gap-2 cursor-pointer active:scale-95 flex-shrink-0"
          >
            <Plus className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Create Project Group</span>
          </button>
        </div>
      </div>

      {/* Segmented Filter Pills */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/10 w-fit backdrop-blur-md">
        {isStudent ? (
          <>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>All My Projects</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-sans font-medium ${activeFilter === 'all' ? 'bg-black/15 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
                {counts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('leading')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'leading'
                  ? 'bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>Projects I Lead</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-sans font-medium ${activeFilter === 'leading' ? 'bg-black/15 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
                {counts.leading}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('collaborating')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'collaborating'
                  ? 'bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>Working In</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-sans font-medium ${activeFilter === 'collaborating' ? 'bg-black/15 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
                {counts.collaborating}
              </span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>All Projects</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-sans font-medium ${activeFilter === 'all' ? 'bg-black/15 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
                {counts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('myTeam')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'myTeam'
                  ? 'bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>My Department Teams</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-sans font-medium ${activeFilter === 'myTeam' ? 'bg-black/15 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
                {counts.myTeam}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('aiml')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'aiml'
                  ? 'bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>AIML Department</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-sans font-medium ${activeFilter === 'aiml' ? 'bg-black/15 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
                {counts.aiml}
              </span>
            </button>
          </>
        )}
      </div>

      {/* Projects Grid (Apple Cupertino Showcase) */}
      {filteredProjects.length === 0 ? (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto p-8 rounded-3xl bg-white/[0.02] border border-white/10">
          <div className="w-12 h-12 rounded-full bg-[#c9b8a0]/10 border border-[#c9b8a0]/20 flex items-center justify-center mx-auto text-[#f5e6c8]">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-semibold text-white">
            No Project Groups Found
          </h3>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            {isStudent
              ? "You are not enrolled in any project matching this filter. Create a new project group or ask your team leader to add your PRN to their roster."
              : "No institutional projects found matching the active filter."}
          </p>
          {isStudent && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] text-black font-semibold text-xs tracking-wide transition-all shadow-sm flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Plus className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Create Project Group</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const isLeader = project.teamLeaderPrn === userPrn;
            const quotaPercentage = Math.round((project.currentAllocatedCount / project.hardwareBudgetCap) * 100);

            return (
              <div
                key={project.id}
                onClick={() => navigate(`/workspace/projects/${project.id}`)}
                className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#121422]/90 via-[#0e0f18]/85 to-[#08090f]/95 border border-white/10 hover:border-[#c9b8a0]/40 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between group cursor-pointer shadow-[0_12px_40px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-6 overflow-hidden"
              >
                {/* Specular Edge Highlight */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                {/* Top Strip */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-sans font-medium text-zinc-300">
                      {project.courseCode}
                    </span>
                    <span className="text-xs font-sans text-zinc-400 font-medium group-hover:text-zinc-200 transition-colors">
                      {project.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isLeader ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#c9b8a0]/20 text-[#f5e6c8] border border-[#c9b8a0]/40 flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f5e6c8]" />
                        <span>Team Lead (You)</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.06] text-[#e2d2bc] border border-white/10 flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0]" />
                        <span>Working In</span>
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full text-[11px] font-sans font-medium bg-white/[0.04] text-zinc-300 border border-white/10 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0]" />
                      <span>{project.reliabilityScore}% Integrity</span>
                    </span>
                  </div>
                </div>

                {/* Title & Technical Abstract */}
                <div className="space-y-2">
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-white tracking-tight group-hover:text-[#f5e6c8] transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed line-clamp-2">
                    {project.abstract}
                  </p>
                </div>

              {/* Physical Hardware Showcase Pedestals */}
              <div className="pt-2 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-sans">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#c9b8a0]" />
                    <span>Allocated Hardware Staging</span>
                  </span>
                  <span className="text-zinc-400 font-sans text-xs">
                    {project.currentAllocatedCount} of {project.hardwareBudgetCap} Units Used
                  </span>
                </div>

                {project.allocatedItems && project.allocatedItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.allocatedItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-3 group-hover:border-white/20 transition-all shadow-inner"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 p-1.5 flex items-center justify-center flex-shrink-0">
                          <img
                            src={getItemImage(item)}
                            alt={item.nomenclature}
                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                            onError={(e) => {
                              e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-white text-xs font-semibold truncate font-sans">
                            {item.nomenclature}
                          </div>
                          <div className="text-[11px] font-sans font-medium text-[#c9b8a0] truncate mt-0.5">
                            {item.assetTag}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-zinc-400 font-sans flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <span>All {project.hardwareBudgetCap} hardware allocation slots currently available.</span>
                  </div>
                )}

                {/* Quota Progress Bar (Luxury Gold Matching Brand Design) */}
                <div className="space-y-1 pt-1">
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(201,184,160,0.6)]"
                      style={{ width: `${Math.min(100, quotaPercentage)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer with Team Roster & Inspect CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-sans">
                {/* Team Avatar Stack */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center -space-x-2 flex-shrink-0">
                    {project.members?.map((member, mIdx) => {
                      const avatarColors = [
                        'from-indigo-500/30 to-blue-500/20 text-indigo-200 border-indigo-500/40',
                        'from-sky-500/30 to-cyan-500/20 text-sky-200 border-sky-500/40',
                        'from-amber-500/30 to-orange-500/20 text-amber-200 border-amber-500/40',
                        'from-emerald-500/30 to-teal-500/20 text-emerald-200 border-emerald-500/40',
                        'from-purple-500/30 to-pink-500/20 text-purple-200 border-purple-500/40',
                      ];
                      const colorClass = avatarColors[mIdx % avatarColors.length];
                      return (
                        <div
                          key={member.prn}
                          className={`w-7 h-7 rounded-full bg-gradient-to-tr ${colorClass} border-2 border-[#0e101a] font-semibold text-[11px] flex items-center justify-center shadow-sm`}
                          title={`${member.name} (${member.role})`}
                        >
                          {member.name.charAt(0)}
                        </div>
                      );
                    })}
                  </div>

                  <div className="min-w-0">
                    <div className="text-white font-medium truncate max-w-[150px] sm:max-w-[200px]">
                      {project.members?.[0]?.name}
                    </div>
                    <div className="text-zinc-500 text-[11px] font-sans truncate">
                      Guide: {project.mentorName}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/workspace/projects/${project.id}`);
                  }}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] hover:opacity-95 text-black transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 flex-shrink-0"
                >
                  <span>Inspect Team</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Manual Group Creation Modal (Form Team & Add Friends) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormError('');
        }}
        title="Register Capstone Project Group"
        subtitle="Create your official student hardware research team, bind a mentor, and add your teammates."
      >
        <form onSubmit={handleCreateGroup} className="space-y-5 text-xs font-sans">
          {/* Project Title */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
              Project Group Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Autonomous Vision Rover & Edge Sensor Network"
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c9b8a0] transition-all text-sm font-medium"
            />
          </div>

          {/* Course & Mentor Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                Course Term
              </label>
              <select
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#121316] border border-white/10 rounded-2xl text-white text-xs focus:outline-none focus:border-[#c9b8a0]"
              >
                <option value="DCDS-SY-AIML">DCDS-SY-AIML (Semester III)</option>
                <option value="CCE-TY-AIML">CCE-TY-AIML (Semester V)</option>
                <option value="AIML-CAPSTONE-IV">AIML-CAPSTONE-IV (Final Year)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                Faculty Mentor
              </label>
              <select
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#121316] border border-white/10 rounded-2xl text-white text-xs focus:outline-none focus:border-[#c9b8a0]"
              >
                <option value="Dr. Meenakshi Sharma">Dr. Meenakshi Sharma (T100458 - Lab In-Charge)</option>
                <option value="Dr. Manoj Patil">Dr. Manoj Patil (T100460 - Lab In-Charge)</option>
                <option value="Dr. Sandeep Shinde">Dr. Sandeep Shinde (T100461 - Lab In-Charge)</option>
                <option value="Dr. Sumit Kumar">Dr. Sumit Kumar (T100101 - HoD AIML)</option>
              </select>
            </div>
          </div>

          {/* Add Teammates / Friends Section */}
          <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#c9b8a0]" />
                <span>Team Roster Builder (Add Friends)</span>
              </div>
              <span className="text-xs text-zinc-400 font-sans font-medium">
                {1 + friends.length} Members
              </span>
            </div>

            {/* Current Student (Team Lead Badge) */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-white/10 text-white font-bold text-[10px] flex items-center justify-center">
                  {(currentUser?.name || 'R').charAt(0)}
                </div>
                <div>
                  <div className="text-white text-xs font-semibold">{currentUser?.name || 'Rahul Sharma'}</div>
                  <div className="text-[11px] font-sans text-zinc-400">{currentUser?.prn || '202401048'}</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#c9b8a0]/20 text-[#f5e6c8] border border-[#c9b8a0]/30 text-[10px] font-semibold">
                Team Lead (You)
              </span>
            </div>

            {/* Added Friends List */}
            {friends.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-[10px] uppercase font-semibold text-zinc-500">Invited Teammates</div>
                <div className="space-y-1.5">
                  {friends.map((friend) => (
                    <div
                      key={friend.prn}
                      className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/10 text-white font-semibold text-[10px] flex items-center justify-center">
                          {friend.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-white font-medium">{friend.name}</span>
                          <span className="text-zinc-400 font-sans text-[11px] ml-1.5">({friend.prn})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-zinc-400 font-sans">{friend.role}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFriend(friend.prn)}
                          className="w-5 h-5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                          title="Remove teammate"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inline Form to Add a Friend */}
            <div className="pt-3 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Invite Teammate / Friend
                </span>
                <span className="text-[10px] text-zinc-500 font-sans">
                  Enter student details & assign responsibility
                </span>
              </div>

              {/* Row 1: Teammate Name & PRN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-zinc-400 font-medium block mb-1">
                    Teammate Full Name
                  </label>
                  <input
                    type="text"
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                    placeholder="e.g. Priya Nair"
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 text-xs focus:outline-none focus:border-[#c9b8a0] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 font-medium block mb-1">
                    University PRN / Roll
                  </label>
                  <input
                    type="text"
                    value={friendPrn}
                    onChange={(e) => setFriendPrn(e.target.value)}
                    placeholder="e.g. 202401052"
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 text-xs font-sans focus:outline-none focus:border-[#c9b8a0] transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Role Assignment & Add Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5">
                <div className="flex-1">
                  <label className="text-[10px] text-zinc-400 font-medium block mb-1">
                    Project Role Assignment
                  </label>
                  <input
                    type="text"
                    value={friendRole}
                    onChange={(e) => setFriendRole(e.target.value)}
                    placeholder="e.g. Firmware & Sensors Lead"
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 text-xs focus:outline-none focus:border-[#c9b8a0] transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddFriend}
                  className="h-[38px] px-4 rounded-xl bg-white/[0.08] hover:bg-white text-zinc-200 hover:text-black font-semibold text-xs border border-white/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Teammate</span>
                </button>
              </div>
            </div>
          </div>

          {/* Project Abstract */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
              Project Technical Abstract
            </label>
            <textarea
              rows={2}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Describe your project objective and target hardware requirements..."
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c9b8a0] transition-all text-xs leading-relaxed"
            />
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setFormError('');
              }}
              className="px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] hover:opacity-95 text-black font-semibold text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(201,184,160,0.3)] cursor-pointer active:scale-95"
            >
              Register Group
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProjectDirectoryPage;
