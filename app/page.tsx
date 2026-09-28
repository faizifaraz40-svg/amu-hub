"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
const gateImg = "/images/4514c35ab9758d56-image_search_0_aligarh_muslim_university_campus_gate.png";
const buildingsImg = "/images/8b0a9f53e3fe60b4-image_search_1_amu_university_buildings.png";
const campusImg = "/images/7128a0ea5ed8ddf0-image_search_2_amu_students_campus_life.png";

type Category = "Academics" | "Campus" | "Hostel" | "Opportunities" | "Buy / Sell" | "Confessions";

type Reply = {
  id: number;
  author: string;
  course?: string;
  year?: string;
  content: string;
  time: string;
};

type Post = {
  id: number;
  author: string;
  course?: string;
  year?: string;
  time: string;
  title: string;
  content: string;
  category: Category;
  upvotes: number;
  upvoted: boolean;
  replies: Reply[];
  saved?: boolean;
};

type User = {
  username: string;
  course?: string;
  year?: string;
};

type Message = {
  id: number;
  from: string;
  text: string;
  time: string;
};

type MsgRequest = {
  id: number;
  from: User;
  to: User;
  postTitle: string;
  postId: number;
  status: "pending" | "accepted" | "declined" | "blocked";
  messages: Message[];
};

type Page = "landing" | "home" | "post" | "create" | "search" | "messages" | "profile";

const CATEGORIES: Category[] = ["Academics", "Campus", "Hostel", "Opportunities", "Buy / Sell", "Confessions"];

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: "anonymous_482",
    course: "BCom",
    year: "2nd Year",
    time: "2h",
    title: "Does anyone know when the scholarship form deadline is?",
    content: "The website shows 30th but seniors said it got extended. Can someone confirm the exact date for merit-cum-means? Also do we need income certificate again?",
    category: "Academics",
    upvotes: 24,
    upvoted: false,
    replies: [
      { id: 1, author: "anonymous_119", course: "BCom", year: "3rd Year", content: "Try checking the department notice board. They put updated list yesterday.", time: "1h" },
      { id: 2, author: "anonymous_482", content: "It's extended till 15th Dec as per dean office. I submitted today.", time: "45m" },
    ],
  },
  {
    id: 2,
    author: "anonymous_331",
    course: "Engineering",
    year: "1st Year",
    time: "5h",
    title: "Where can I find previous semester question papers?",
    content: "Need CSE first sem papers, especially Physics and Maths. Library has only 2019 bundle. Anyone has PDF drive link?",
    category: "Academics",
    upvotes: 18,
    upvoted: false,
    replies: [
      { id: 3, author: "anonymous_207", content: "I have the PDF. I can send it here. DM me after request.", time: "3h" },
    ],
  },
  {
    id: 3,
    author: "anonymous_904",
    year: "2nd Year",
    time: "8h",
    title: "Anyone travelling from Aligarh to Delhi this weekend?",
    content: "Planning to leave Friday evening after 6pm. Can share cab or train. Looking for 2 more people.",
    category: "Campus",
    upvotes: 12,
    upvoted: false,
    replies: [
      { id: 4, author: "anonymous_521", content: "I'm going Sat morning. Interested?", time: "6h" },
    ],
  },
  {
    id: 4,
    author: "anonymous_118",
    course: "BBA",
    year: "1st Year",
    time: "1d",
    title: "What books should I use for Financial Accounting?",
    content: "Prof suggested T.S. Grewal but seniors said Sehgal is enough for internals. Confused. What did you use?",
    category: "Academics",
    upvotes: 16,
    upvoted: false,
    replies: [
      { id: 5, author: "anonymous_302", course: "BBA", year: "2nd Year", content: "Sehgal + past papers is more than enough. Grewal only if you want deep.", time: "12h" },
    ],
  },
  {
    id: 5,
    author: "anonymous_672",
    time: "1d",
    title: "Is the library open on Sunday?",
    content: "Need to sit for long hours for end sems. Maulana Azad library timings on Sunday?",
    category: "Campus",
    upvotes: 22,
    upvoted: true,
    saved: true,
    replies: [],
  },
  {
    id: 6,
    author: "anonymous_210",
    course: "Engineering",
    year: "2nd Year",
    time: "1d",
    title: "Which hostel has the quietest rooms?",
    content: "Allotted SS North but heard it's noisy due to construction. Anyone in MM Hall or others can suggest?",
    category: "Hostel",
    upvotes: 9,
    upvoted: false,
    replies: [
      { id: 6, author: "anonymous_880", content: "MM is quieter but food is average. SS South is better balanced.", time: "18h" },
    ],
  },
  {
    id: 7,
    author: "anonymous_553",
    year: "1st Year",
    time: "2d",
    title: "Any internships open for first-year students?",
    content: "Looking for content writing or social media internships around AMU. Stipend not important, learning matters.",
    category: "Opportunities",
    upvotes: 31,
    upvoted: false,
    replies: [
      { id: 7, author: "anonymous_114", content: "Check Literary Club and Entrepreneurship Cell notices near admin block.", time: "1d" },
    ],
  },
  {
    id: 8,
    author: "anonymous_441",
    course: "BSc",
    year: "3rd Year",
    time: "2d",
    title: "Selling my calculator, barely used.",
    content: "Casio FX-991ES PLUS, 6 months old, bill available. Bought for 1250, selling 850. DM for pics.",
    category: "Buy / Sell",
    upvotes: 7,
    upvoted: false,
    replies: [],
  },
  {
    id: 9,
    author: "anonymous_290",
    time: "3d",
    title: "I've been at AMU for two months and still don't know anyone 😭",
    content: "Hostel life is okay but feels lonely after classes. How did you all make friends in first year? Any clubs open for newcomers?",
    category: "Confessions",
    upvotes: 44,
    upvoted: false,
    replies: [
      { id: 8, author: "anonymous_102", content: "Same here. Come to Drama Club auditions this Friday at Kennedy hall.", time: "2d" },
      { id: 9, author: "anonymous_443", content: "Go to canteen after 5pm, you'll meet people. Don't stay in room.", time: "2d" },
    ],
  },
];

const RECENT_SEARCHES = ["hostel fees", "BBA books", "scholarship", "question papers", "library", "internship", "admission"];

function App() {
  const [page, setPage] = useState<Page>("landing");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showJoin, setShowJoin] = useState(false);
  const [joinForm, setJoinForm] = useState({ username: "anonymous_482", course: "", year: "", agreed: false });
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [feedTab, setFeedTab] = useState<"trending" | "latest" | "unanswered">("trending");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: "post" | "reply" | "message"; id: number } | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [showPostMenu, setShowPostMenu] = useState<number | null>(null);
  const [msgRequests, setMsgRequests] = useState<MsgRequest[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [msgTab, setMsgTab] = useState<"requests" | "chats">("requests");
  const [newPostForm, setNewPostForm] = useState({ category: "Academics" as Category, title: "", content: "", anon: true });
  const [replyDraft, setReplyDraft] = useState("");
  const [profileTab, setProfileTab] = useState<"posts" | "replies" | "saved" | "settings">("posts");
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [dmEnabled, setDmEnabled] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [myRepliesCache, setMyRepliesCache] = useState<{ postId: number; reply: Reply }[]>([]);

  const communityRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const generateUsername = () => {
    const n = Math.floor(100 + Math.random() * 900);
    setJoinForm((f) => ({ ...f, username: `anonymous_${n}` }));
  };

  const handleJoin = () => {
    if (!joinForm.agreed) {
      showToast("Please agree to community rules");
      return;
    }
    if (!joinForm.username.trim()) {
      showToast("Username required");
      return;
    }
    const u: User = { username: joinForm.username.trim(), course: joinForm.course || undefined, year: joinForm.year || undefined };
    setUser(u);
    setShowJoin(false);
    setPage("home");
    showToast(`Welcome, ${u.username}`);
  };

  const selectedPost = useMemo(() => posts.find((p) => p.id === selectedPostId) || null, [posts, selectedPostId]);

  const filteredPosts = useMemo(() => {
    let list = [...posts];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => (p.title + " " + p.content + " " + p.category).toLowerCase().includes(q));
    }
    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (feedTab === "trending") {
      list = list.sort((a, b) => b.upvotes - a.upvotes);
    } else if (feedTab === "latest") {
      list = list.sort((a, b) => b.id - a.id);
    } else if (feedTab === "unanswered") {
      list = list.filter((p) => p.replies.length === 0);
    }
    return list;
  }, [posts, searchQuery, selectedCategory, feedTab]);

  const openPost = (id: number) => {
    setSelectedPostId(id);
    setPage("post");
    window.scrollTo(0, 0);
  };

  const handleUpvote = (id: number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, upvoted: !p.upvoted, upvotes: p.upvoted ? p.upvotes - 1 : p.upvotes + 1 } : p))
    );
  };

  const handleCreatePost = () => {
    if (!newPostForm.title.trim()) {
      showToast("Title is required");
      return;
    }
    if (!user) {
      setShowJoin(true);
      return;
    }
    const newPost: Post = {
      id: Date.now(),
      author: newPostForm.anon ? user.username : user.username,
      course: user.course,
      year: user.year,
      time: "now",
      title: newPostForm.title.trim(),
      content: newPostForm.content.trim(),
      category: newPostForm.category,
      upvotes: 1,
      upvoted: true,
      replies: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setNewPostForm({ category: "Academics", title: "", content: "", anon: true });
    setPage("home");
    showToast("Posted to community");
  };

  const handleAddReply = () => {
    if (!replyDraft.trim() || !selectedPost || !user) return;
    const newReply: Reply = {
      id: Date.now(),
      author: user.username,
      course: user.course,
      year: user.year,
      content: replyDraft.trim(),
      time: "now",
    };
    setPosts((prev) => prev.map((p) => (p.id === selectedPost.id ? { ...p, replies: [...p.replies, newReply] } : p)));
    setMyRepliesCache((prev) => [...prev, { postId: selectedPost.id, reply: newReply }]);
    setReplyDraft("");
    showToast("Reply added");
  };

  const handleMessageAuthor = (post: Post) => {
    if (!user) {
      setShowJoin(true);
      return;
    }
    if (post.author === user.username) {
      showToast("You can't message yourself");
      return;
    }
    if (!dmEnabled) {
      showToast("Enable DMs in Profile > Settings first");
      setPage("profile");
      setProfileTab("settings");
      return;
    }
    const exists = msgRequests.find((r) => r.postId === post.id && r.from.username === user.username);
    if (exists) {
      showToast("Request already sent");
      setPage("messages");
      return;
    }
    const newReq: MsgRequest = {
      id: Date.now(),
      from: user,
      to: { username: post.author, course: post.course, year: post.year },
      postTitle: post.title,
      postId: post.id,
      status: "pending",
      messages: [{ id: Date.now(), from: user.username, text: `Hi! About your post "${post.title.slice(0, 40)}..."`, time: "now" }],
    };
    setMsgRequests((prev) => [newReq, ...prev]);
    setPage("messages");
    setMsgTab("requests");
    showToast("Message request sent");
  };

  const handleAccept = (id: number) => {
    setMsgRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r)));
    setActiveChatId(id);
    setMsgTab("chats");
  };
  const handleDecline = (id: number) => {
    setMsgRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "declined" } : r)));
    showToast("Request declined");
  };
  const handleBlockUser = (username: string) => {
    setBlockedUsers((prev) => (prev.includes(username) ? prev : [...prev, username]));
    setMsgRequests((prev) => prev.map((r) => (r.from.username === username || r.to.username === username ? { ...r, status: "blocked" } : r)));
    showToast(`${username} blocked`);
    setShowPostMenu(null);
  };
  const handleSendChat = () => {
    if (!chatInput.trim() || activeChatId === null || !user) return;
    setMsgRequests((prev) =>
      prev.map((r) => (r.id === activeChatId ? { ...r, messages: [...r.messages, { id: Date.now(), from: user.username, text: chatInput.trim(), time: "now" }] } : r))
    );
    setChatInput("");
  };

  const myPosts = useMemo(() => (user ? posts.filter((p) => p.author === user.username) : []), [posts, user]);
  const savedPosts = useMemo(() => posts.filter((p) => p.saved || p.upvoted), [posts]);

  useEffect(() => {
    if (showJoin || reportTarget || showPostMenu !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showJoin, reportTarget, showPostMenu]);

  // --- Reusable pieces ---
  const Logo = () => (
    <div className="flex items-baseline gap-[2px] tracking-[-0.02em] cursor-pointer" onClick={() => (user ? setPage("home") : setPage("landing"))}>
      <span className="font-bold text-[18px]">AMU</span>
      <span className="font-normal text-[18px] ml-[3px]">Hub</span>
    </div>
  );

  const PostCard = ({ post, compact }: { post: Post; compact?: boolean }) => (
    <div
      onClick={() => !compact && openPost(post.id)}
      className={`bg-white border border-[#E8E6E1] rounded-[10px] p-[16px] ${!compact ? "cursor-pointer hover:border-[#D6D3CE] transition-colors" : ""} shadow-[0_1px_2px_rgba(0,0,0,0.04)]`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-[10px] items-start">
          <div className="w-[28px] h-[28px] rounded-full bg-[#F3F1EC] border border-[#E8E6E1] flex items-center justify-center text-[11px] font-medium text-[#111] mt-[1px]">A</div>
          <div>
            <div className="flex items-center gap-[6px] flex-wrap">
              <span className="text-[13px] font-medium text-[#111]">Anonymous</span>
              {(post.course || post.year) && (
                <span className="text-[12px] text-[#6B6B6B]">
                  {post.course ? `${post.course}` : ""} {post.course && post.year ? "·" : ""} {post.year ? `${post.year}` : ""}
                </span>
              )}
              <span className="text-[11px] text-[#8A8A8A]">· {post.time}</span>
            </div>
            <h3 className="text-[15.5px] leading-[22px] font-medium text-[#111] mt-[6px]">{post.title}</h3>
            {!compact && post.content && (
              <p className="text-[14px] leading-[20px] text-[#4A4A4A] mt-[6px] line-clamp-2">{post.content}</p>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPostMenu(showPostMenu === post.id ? null : post.id);
          }}
          className="w-[28px] h-[28px] rounded-[6px] hover:bg-[#F7F6F3] flex items-center justify-center text-[#8A8A8A] text-[18px] leading-none"
        >
          …
        </button>
      </div>
      <div className="flex items-center gap-[10px] mt-[12px] flex-wrap">
        <span className="inline-flex px-[8px] py-[3px] rounded-full text-[11px] font-medium bg-[#F3F1EC] text-[#5A5A5A] border border-[#E8E6E1]">{post.category}</span>
        <div className="flex items-center gap-[12px] ml-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpvote(post.id);
            }}
            className={`flex items-center gap-[4px] text-[13px] ${post.upvoted ? "text-[#132E26] font-medium" : "text-[#6B6B6B]"} hover:text-[#111]`}
          >
            <span className="text-[14px]">↑</span> {post.upvotes}
          </button>
          <span className="text-[13px] text-[#6B6B6B]">{post.replies.length} replies</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              showToast("Link copied");
            }}
            className="text-[13px] text-[#6B6B6B] hover:text-[#111]"
          >
            Share
          </button>
        </div>
      </div>
      {showPostMenu === post.id && (
        <div className="fixed inset-0 z-40" onClick={() => setShowPostMenu(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bg-white border border-[#E8E6E1] rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-[6px] w-[180px]"
            style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
          >
            <button onClick={() => { setReportTarget({ type: "post", id: post.id }); setShowPostMenu(null); }} className="w-full text-left px-[12px] py-[9px] rounded-[6px] text-[13px] hover:bg-[#F7F6F3]">Report</button>
            <button onClick={() => handleBlockUser(post.author)} className="w-full text-left px-[12px] py-[9px] rounded-[6px] text-[13px] hover:bg-[#F7F6F3]">Block {post.author}</button>
            <button onClick={() => { showToast("Link copied"); setShowPostMenu(null); }} className="w-full text-left px-[12px] py-[9px] rounded-[6px] text-[13px] hover:bg-[#F7F6F3]">Share</button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FEFEFD] text-[#111] antialiased" style={{ fontFamily: "Inter, ui-sans-system, -apple-system, Segoe UI, Roboto, Helvetica, Arial" }}>
      <style>{`
        *{ -webkit-font-smoothing: antialiased; }
        .line-clamp-2{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
      `}</style>

      {/* TOP NAV */}
      <header className="sticky top-0 z-30 bg-[#FEFEFD]/90 backdrop-blur-[6px] border-b border-[#E8E6E1]">
        <div className="mx-auto max-w-[1120px] px-[16px] md:px-[20px] h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-[24px]">
            <Logo />
            {/* Desktop nav for landing */}
            {page === "landing" ? (
              <nav className="hidden md:flex items-center gap-[20px] text-[14px] text-[#4A4A4A]">
                <button onClick={() => { communityRef.current?.scrollIntoView({ behavior: "smooth" }); showToast("Exploring AMU discussions"); setPage("home"); }} className="hover:text-[#111]">Explore</button>
                <button onClick={() => { communityRef.current?.scrollIntoView({ behavior: "smooth" }); showToast("Communities: Academics, Campus, Hostel..."); }} className="hover:text-[#111]">Communities</button>
                <button onClick={() => { setPage("search"); window.scrollTo(0,0); showToast("Search AMU Hub"); }} className="hover:text-[#111]">Search</button>
              </nav>
            ) : (
              <nav className="hidden md:flex items-center gap-[18px] text-[14px]">
                <button onClick={() => setPage("home")} className={`${page === "home" ? "text-[#111] font-medium" : "text-[#6B6B6B] hover:text-[#111]"}`}>Home</button>
                <button onClick={() => { setPage("search"); showToast("Explore discussions"); }} className={`${page === "search" ? "text-[#111] font-medium" : "text-[#6B6B6B] hover:text-[#111]"}`}>Explore</button>
                <button onClick={() => { setSelectedCategory(null); setPage("home"); showToast("Communities filtered: All"); }} className="text-[#6B6B6B] hover:text-[#111]">Communities</button>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-[10px]">
            {page === "landing" ? (
              <>
                <button onClick={() => { setShowJoin(true); showToast("Opening login..."); }} className="hidden md:inline-flex text-[14px] text-[#111] px-[12px] py-[8px] rounded-[8px] hover:bg-[#F7F6F3]" data-testid="login-btn">Log in</button>
                <button onClick={() => { setShowJoin(true); showToast("Joining AMU Hub..."); }} className="inline-flex items-center justify-center h-[36px] px-[16px] rounded-[8px] bg-[#132E26] text-white text-[14px] font-medium hover:bg-[#0F241E]" data-testid="join-btn">Join anonymously</button>
                <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden w-[36px] h-[36px] rounded-[8px] border border-[#E8E6E1] flex items-center justify-center">≡</button>
              </>
            ) : (
              <>
                {user ? (
                  <>
                    <div className="hidden md:flex items-center gap-[10px]">
                      <div className="relative">
                        <input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onFocus={() => setPage("search")}
                          placeholder="Search AMU Hub..."
                          className="w-[260px] h-[36px] pl-[32px] pr-[12px] rounded-[8px] bg-[#F7F6F3] border border-[#E8E6E1] text-[14px] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#132E26]/30"
                        />
                        <span className="absolute left-[10px] top-[9px] text-[#8A8A8A] text-[14px]">⌕</span>
                      </div>
                      <button onClick={() => setPage("create")} className="h-[36px] px-[14px] rounded-[8px] bg-[#132E26] text-white text-[14px] font-medium">+ Ask</button>
                      <button onClick={() => setPage("profile")} className="w-[32px] h-[32px] rounded-full bg-[#F3F1EC] border border-[#E8E6E1] text-[12px]">A</button>
                    </div>
                    <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden w-[36px] h-[36px] rounded-[8px] border border-[#E8E6E1] flex items-center justify-center">≡</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setShowJoin(true)} className="text-[14px] px-[12px] py-[8px]">Log in</button>
                    <button onClick={() => setShowJoin(true)} className="h-[36px] px-[14px] rounded-[8px] bg-[#132E26] text-white text-[14px] font-medium">Join anonymously</button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden border-t border-[#E8E6E1] bg-white px-[16px] py-[14px] flex flex-col gap-[10px]">
            {page === "landing" ? (
              <>
                <button onClick={() => { setShowMobileMenu(false); communityRef.current?.scrollIntoView({ behavior: "smooth" }); }} className="text-left text-[14px] py-[8px]">Explore</button>
                <button onClick={() => { setShowMobileMenu(false); communityRef.current?.scrollIntoView({ behavior: "smooth" }); }} className="text-left text-[14px] py-[8px]">Communities</button>
                <button onClick={() => { setShowMobileMenu(false); setPage("search"); }} className="text-left text-[14px] py-[8px]">Search</button>
                <button onClick={() => { setShowMobileMenu(false); setShowJoin(true); }} className="mt-[6px] h-[40px] rounded-[8px] bg-[#132E26] text-white text-[14px]">Join anonymously</button>
              </>
            ) : (
              <>
                <button onClick={() => { setShowMobileMenu(false); setPage("home"); }} className="text-left text-[14px] py-[8px]">Home</button>
                <button onClick={() => { setShowMobileMenu(false); setPage("search"); }} className="text-left text-[14px] py-[8px]">Search</button>
                <button onClick={() => { setShowMobileMenu(false); setPage("create"); }} className="text-left text-[14px] py-[8px]">Ask a question</button>
                <button onClick={() => { setShowMobileMenu(false); setPage("messages"); }} className="text-left text-[14px] py-[8px]">Messages</button>
                <button onClick={() => { setShowMobileMenu(false); setPage("profile"); }} className="text-left text-[14px] py-[8px]">Profile</button>
              </>
            )}
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-[1120px] px-[18px] md:px-[24px] pb-[120px] md:pb-[40px]">
        {page === "landing" && (
          <div className="pt-[28px] md:pt-[48px]">
            {/* HERO */}
            <div className="flex flex-col lg:flex-row gap-[32px] lg:gap-[56px] items-start">
              <div className="flex-1 min-w-0">
                <h1 className="text-[34px] md:text-[44px] leading-[0.95] tracking-[-0.03em] font-[700] text-[#111]">
                  AMU students.<br />One place.
                </h1>
                <p className="mt-[16px] text-[15px] leading-[24px] text-[#4A4A4A] max-w-[520px]">
                  Ask questions, find answers, discuss campus life and connect with other AMU students — anonymously.
                </p>
                <div className="mt-[24px] flex items-center gap-[14px]">
                  <button onClick={() => { setShowJoin(true); showToast("Joining AMU Hub..."); }} className="h-[44px] px-[20px] rounded-[8px] bg-[#132E26] text-white text-[14px] font-medium hover:bg-[#0F241E]" data-testid="join-hero">Join anonymously</button>
                  <button onClick={() => { communityRef.current?.scrollIntoView({ behavior: "smooth" }); showToast("Exploring discussions"); setPage("home"); }} className="h-[44px] px-[16px] rounded-[8px] border border-[#E8E6E1] bg-white text-[14px] text-[#111] hover:bg-[#F7F6F3]">Explore discussions</button>
                </div>

                <div className="mt-[32px] md:hidden">
                  <div className="rounded-[12px] border border-[#E8E6E1] overflow-hidden bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    <img src={gateImg} alt="AMU Campus Gate" className="w-full h-[200px] object-cover" />
                    <div className="px-[12px] py-[10px] flex items-center justify-between">
                      <span className="text-[12px] text-[#6B6B6B]">Bab-e-Syed · AMU Campus</span>
                      <span className="text-[11px] px-[6px] py-[2px] rounded-full bg-[#F3F1EC] border border-[#E8E6E1]">Verified campus</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:block w-[360px] shrink-0">
                <div className="rounded-[12px] border border-[#E8E6E1] overflow-hidden bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <img src={gateImg} alt="AMU Campus Gate" className="w-full h-[220px] object-cover" />
                  <div className="p-[12px] flex items-center justify-between border-t border-[#F0EEEA]">
                    <div>
                      <div className="text-[13px] font-medium">Bab-e-Syed Gate</div>
                      <div className="text-[12px] text-[#6B6B6B]">Strachey Hall · AMU</div>
                    </div>
                    <span className="text-[11px] px-[7px] py-[3px] rounded-full bg-[#F7F6F3] border border-[#E8E6E1]">Campus</span>
                  </div>
                </div>
                <div className="mt-[12px] rounded-[10px] border border-[#E8E6E1] bg-[#F7F6F3] p-[12px] text-[13px] leading-[18px] text-[#4A4A4A]">
                  <span className="font-medium text-[#111]">Anonymous by default.</span> No real names shown publicly. Backend moderation for safety.
                </div>
              </div>
            </div>

            {/* PROBLEM */}
            <div className="mt-[64px] md:mt-[84px] grid md:grid-cols-[1.1fr_0.9fr] gap-[24px] items-start">
              <div className="rounded-[12px] bg-[#F7F6F3] border border-[#E8E6E1] p-[20px] md:p-[24px]">
                <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Everything is scattered.</h2>
                <p className="mt-[10px] text-[14px] leading-[22px] text-[#4A4A4A]">
                  Useful AMU information currently lives across WhatsApp groups, Reddit threads, confession pages, Telegram groups, and random conversations. A student might need to search 10–20 different places to find one answer.
                </p>
                <div className="mt-[14px] flex flex-wrap gap-[8px]">
                  {["WhatsApp groups", "Reddit", "Confession pages", "Telegram", "Random chats"].map((s) => (
                    <span key={s} className="text-[11px] px-[8px] py-[4px] rounded-full bg-white border border-[#E8E6E1] text-[#6B6B6B]">{s}</span>
                  ))}
                </div>
                <div className="mt-[18px] text-[15px] font-medium">AMU Hub brings it together.</div>
                <div className="mt-[14px] rounded-[10px] overflow-hidden border border-[#E8E6E1] bg-white">
                  <img src={buildingsImg} alt="AMU Buildings" className="w-full h-[110px] object-cover" />
                  <div className="px-[12px] py-[8px] text-[11px] text-[#6B6B6B]">Kennedy Hall · Academic Block · AMU</div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-[12px]">
                {[
                  { t: "Ask", d: "Ask questions and get help from other AMU students." },
                  { t: "Search", d: "Find old questions, answers, notices, recommendations and discussions." },
                  { t: "Discuss", d: "Talk about academics, campus life, hostel life and opportunities." },
                  { t: "Stay anonymous", d: "Participate without publicly revealing your real identity." },
                ].map((b) => (
                  <div key={b.t} className="rounded-[10px] border border-[#E8E6E1] bg-white p-[16px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    <div className="text-[13px] font-semibold">{b.t}</div>
                    <div className="text-[13px] text-[#6B6B6B] mt-[4px] leading-[18px]">{b.d}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* COMMUNITY PREVIEW */}
            <div ref={communityRef} className="mt-[64px] scroll-mt-[80px]">
              <div className="flex items-baseline justify-between">
                <h2 className="text-[20px] font-semibold tracking-[-0.02em]">What's happening at AMU?</h2>
                <button onClick={() => (user ? setPage("home") : setShowJoin(true))} className="text-[13px] text-[#6B6B6B] hover:text-[#111]">View all →</button>
              </div>
              <div className="mt-[20px] grid md:grid-cols-3 gap-[16px]">
                {INITIAL_POSTS.slice(0, 3).map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            </div>

            {/* FEATURES */}
            <div className="mt-[64px] rounded-[12px] border border-[#E8E6E1] bg-white p-[22px] md:p-[28px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <h2 className="text-[18px] font-semibold">Everything students actually need.</h2>
              <div className="mt-[20px] grid md:grid-cols-3 gap-[14px] text-[13px]">
                {[
                  "Anonymous discussions",
                  "Searchable answers",
                  "Student-to-student help",
                  "Campus information",
                  "Opportunities",
                  "Private anonymous conversations",
                ].map((f) => (
                  <div key={f} className="flex gap-[10px] items-start border border-[#F0EEEA] rounded-[8px] p-[12px] bg-[#FEFEFD]">
                    <span className="w-[6px] h-[6px] rounded-full bg-[#132E26] mt-[6px]" />
                    <span className="text-[#4A4A4A]">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FINAL CTA */}
            <div className="mt-[48px] rounded-[12px] bg-[#132E26] text-white p-[26px] md:p-[32px] flex flex-col md:flex-row items-start md:items-center justify-between gap-[20px]">
              <div>
                <h3 className="text-[20px] font-semibold tracking-[-0.02em]">Join the AMU community.</h3>
                <p className="text-[13px] text-white/70 mt-[6px] max-w-[520px]">One searchable place for questions, answers, and campus life. Anonymous by default, respectful always.</p>
              </div>
              <div className="flex items-center gap-[12px]">
                <button onClick={() => { setShowJoin(true); showToast("Joining AMU Hub..."); }} className="h-[40px] px-[18px] rounded-[8px] bg-white text-[#132E26] text-[14px] font-medium">Join anonymously</button>
                <img src={campusImg} alt="AMU students" className="hidden md:block w-[64px] h-[40px] object-cover rounded-[8px] border border-white/20" />
              </div>
            </div>

            <div className="mt-[24px] text-[11px] text-[#8A8A8A] leading-[16px] max-w-[720px]">
              Anonymous doesn't mean consequence-free. Be respectful. Don't harass, threaten, expose personal information, or spam. Backend moderation enabled for safety and legal compliance.
            </div>
          </div>
        )}

        {page === "home" && (
          <div className="pt-[16px] md:pt-[24px] flex gap-[20px] items-start">
            {/* Left sidebar desktop */}
            <aside className="hidden lg:block w-[240px] shrink-0 sticky top-[72px]">
              <div className="rounded-[10px] border border-[#E8E6E1] bg-white p-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="text-[12px] font-semibold tracking-wide text-[#6B6B6B] uppercase">Categories</div>
                <div className="mt-[10px] flex flex-col gap-[4px]">
                  <button onClick={() => setSelectedCategory(null)} className={`text-left px-[10px] py-[8px] rounded-[8px] text-[14px] ${!selectedCategory ? "bg-[#132E26] text-white" : "hover:bg-[#F7F6F3] text-[#4A4A4A]"}`}>All</button>
                  {CATEGORIES.map((c) => (
                    <button key={c} onClick={() => setSelectedCategory(c)} className={`text-left px-[10px] py-[8px] rounded-[8px] text-[14px] ${selectedCategory === c ? "bg-[#132E26] text-white" : "hover:bg-[#F7F6F3] text-[#4A4A4A]"}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div className="mt-[12px] rounded-[10px] border border-[#E8E6E1] bg-[#F7F6F3] p-[12px]">
                <div className="text-[12px] font-semibold text-[#6B6B6B] uppercase">Safety</div>
                <p className="text-[12px] leading-[17px] text-[#6B6B6B] mt-[8px]">Anonymous doesn't mean consequence-free. Report harassment, spam, or private info sharing. DMs are request-only.</p>
              </div>
            </aside>

            {/* Center feed */}
            <div className="flex-1 min-w-0 max-w-[640px] mx-auto">
              <div className="flex items-center justify-between gap-[10px]">
                <div className="md:hidden relative flex-1">
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search AMU Hub..." className="w-full h-[38px] pl-[32px] pr-[10px] rounded-[8px] bg-[#F7F6F3] border border-[#E8E6E1] text-[14px] focus:outline-none" />
                  <span className="absolute left-[10px] top-[9px] text-[#8A8A8A]">⌕</span>
                </div>
                <div className="flex items-center gap-[6px] p-[4px] rounded-[10px] bg-[#F7F6F3] border border-[#E8E6E1]">
                  {(["trending", "latest", "unanswered"] as const).map((t) => (
                    <button key={t} onClick={() => setFeedTab(t)} className={`px-[12px] h-[28px] rounded-[7px] text-[13px] capitalize ${feedTab === t ? "bg-white border border-[#E8E6E1] shadow-sm font-medium" : "text-[#6B6B6B] hover:text-[#111]"}`}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Mobile categories chips */}
              <div className="lg:hidden mt-[12px] flex gap-[8px] overflow-x-auto pb-[2px] scrollbar-none">
                <button onClick={() => setSelectedCategory(null)} className={`shrink-0 px-[12px] h-[30px] rounded-full text-[13px] border ${!selectedCategory ? "bg-[#132E26] text-white border-[#132E26]" : "bg-white border-[#E8E6E1] text-[#4A4A4A]"}`}>All</button>
                {CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setSelectedCategory(c)} className={`shrink-0 px-[12px] h-[30px] rounded-full text-[13px] border ${selectedCategory === c ? "bg-[#132E26] text-white border-[#132E26]" : "bg-white border-[#E8E6E1] text-[#4A4A4A]"}`}>{c}</button>
                ))}
              </div>

              <div className="mt-[16px] flex flex-col gap-[10px]">
                {filteredPosts.length === 0 ? (
                  <div className="rounded-[10px] border border-dashed border-[#E8E6E1] bg-white p-[24px] text-center">
                    <div className="text-[14px] font-medium">No posts found</div>
                    <div className="text-[13px] text-[#6B6B6B] mt-[6px]">Try different search or category</div>
                  </div>
                ) : (
                  filteredPosts.map((p) => <PostCard key={p.id} post={p} />)
                )}
              </div>
            </div>

            {/* Right sidebar desktop */}
            <aside className="hidden lg:block w-[240px] shrink-0 sticky top-[72px]">
              <div className="rounded-[10px] border border-[#E8E6E1] bg-white p-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="text-[12px] font-semibold tracking-wide text-[#6B6B6B] uppercase">Trending discussions</div>
                <div className="mt-[12px] flex flex-col gap-[10px]">
                  {posts.slice().sort((a,b)=>b.upvotes-a.upvotes).slice(0,4).map((p)=>(
                    <button key={p.id} onClick={()=>openPost(p.id)} className="text-left">
                      <div className="text-[13px] leading-[18px] font-medium line-clamp-2">{p.title}</div>
                      <div className="text-[11px] text-[#8A8A8A] mt-[4px]">{p.category} · {p.upvotes} ↑</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-[12px] rounded-[10px] border border-[#E8E6E1] overflow-hidden bg-white">
                <img src={buildingsImg} alt="AMU" className="w-full h-[96px] object-cover" />
                <div className="p-[12px]">
                  <div className="text-[12px] font-medium">Strachey Hall · AMU</div>
                  <div className="text-[11px] text-[#6B6B6B] mt-[2px]">Campus info is now searchable. Ask once, help many.</div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {page === "post" && selectedPost && (
          <div className="pt-[16px] md:pt-[24px] max-w-[680px] mx-auto">
            <button onClick={() => setPage("home")} className="text-[13px] text-[#6B6B6B] hover:text-[#111]">← Back to feed</button>
            <div className="mt-[12px] bg-white border border-[#E8E6E1] rounded-[12px] p-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-start justify-between gap-[12px]">
                <div className="flex gap-[10px]">
                  <div className="w-[32px] h-[32px] rounded-full bg-[#F3F1EC] border border-[#E8E6E1] flex items-center justify-center text-[12px]">A</div>
                  <div>
                    <div className="flex items-center gap-[6px] flex-wrap">
                      <span className="text-[14px] font-medium">Anonymous</span>
                      <span className="text-[12px] text-[#6B6B6B]">{selectedPost.course ? `${selectedPost.course} · ` : ""}{selectedPost.year || ""}</span>
                      <span className="text-[11px] text-[#8A8A8A]">· {selectedPost.time}</span>
                    </div>
                    <div className="mt-[2px] inline-flex px-[8px] py-[2px] rounded-full text-[11px] bg-[#F3F1EC] border border-[#E8E6E1]">{selectedPost.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-[8px]">
                  <button onClick={() => handleMessageAuthor(selectedPost)} className="h-[32px] px-[12px] rounded-[8px] border border-[#E8E6E1] bg-white text-[13px] hover:bg-[#F7F6F3]">Message</button>
                  <button onClick={() => setShowPostMenu(showPostMenu === selectedPost.id ? null : selectedPost.id)} className="w-[32px] h-[32px] rounded-[8px] hover:bg-[#F7F6F3]">…</button>
                </div>
              </div>
              <h1 className="mt-[14px] text-[18px] leading-[26px] font-semibold">{selectedPost.title}</h1>
              <p className="mt-[10px] text-[14px] leading-[22px] text-[#2A2A2A]">{selectedPost.content}</p>
              <div className="mt-[14px] flex items-center gap-[14px]">
                <button onClick={() => handleUpvote(selectedPost.id)} className={`text-[13px] ${selectedPost.upvoted ? "text-[#132E26] font-medium" : "text-[#6B6B6B]"}`}>↑ {selectedPost.upvotes} Upvotes</button>
                <span className="text-[13px] text-[#6B6B6B]">{selectedPost.replies.length} replies</span>
                <button onClick={() => showToast("Link copied")} className="text-[13px] text-[#6B6B6B]">Share</button>
              </div>
            </div>

            <div className="mt-[18px]">
              <h2 className="text-[14px] font-semibold">Replies</h2>
              <div className="mt-[10px] flex flex-col gap-[10px]">
                {selectedPost.replies.length === 0 && <div className="text-[13px] text-[#6B6B6B] bg-white border border-dashed border-[#E8E6E1] rounded-[10px] p-[14px]">No replies yet. Be the first to help.</div>}
                {selectedPost.replies.map((r) => (
                  <div key={r.id} className="bg-white border border-[#E8E6E1] rounded-[10px] p-[14px]">
                    <div className="flex items-center gap-[8px]">
                      <div className="w-[24px] h-[24px] rounded-full bg-[#F3F1EC] border border-[#E8E6E1] flex items-center justify-center text-[10px]">A</div>
                      <span className="text-[13px] font-medium">Anonymous</span>
                      <span className="text-[11px] text-[#8A8A8A]">· {r.time}</span>
                      <button onClick={() => { setReportTarget({ type: "reply", id: r.id }); }} className="ml-auto text-[12px] text-[#8A8A8A] hover:text-[#111]">Report</button>
                    </div>
                    <p className="mt-[8px] text-[14px] leading-[20px] text-[#2A2A2A]">{r.content}</p>
                  </div>
                ))}
              </div>

              <div className="mt-[16px] bg-white border border-[#E8E6E1] rounded-[10px] p-[12px]">
                <textarea value={replyDraft} onChange={(e) => setReplyDraft(e.target.value)} placeholder="Write a reply..." className="w-full min-h-[72px] rounded-[8px] border border-[#E8E6E1] bg-[#F7F6F3] p-[12px] text-[14px] focus:outline-none focus:border-[#132E26]/30" />
                <div className="mt-[10px] flex justify-between items-center">
                  <span className="text-[11px] text-[#8A8A8A]">Posting anonymously as {user?.username || "anonymous"}</span>
                  <button onClick={handleAddReply} className="h-[36px] px-[16px] rounded-[8px] bg-[#132E26] text-white text-[13px] font-medium">Reply</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {page === "create" && (
          <div className="pt-[16px] md:pt-[24px] max-w-[600px] mx-auto">
            <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Ask the AMU community</h1>
            <p className="text-[13px] text-[#6B6B6B] mt-[6px]">Simple, anonymous, searchable. Your question helps future students too.</p>

            <div className="mt-[20px] bg-white border border-[#E8E6E1] rounded-[12px] p-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="text-[12px] font-medium text-[#6B6B6B] uppercase tracking-wide">Category</div>
              <div className="mt-[8px] flex flex-wrap gap-[8px]">
                {CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setNewPostForm((f) => ({ ...f, category: c }))} className={`px-[12px] h-[32px] rounded-full text-[13px] border ${newPostForm.category === c ? "bg-[#132E26] text-white border-[#132E26]" : "bg-[#F7F6F3] border-[#E8E6E1] text-[#4A4A4A] hover:border-[#D6D3CE]"}`}>{c}</button>
                ))}
              </div>

              <div className="mt-[18px]">
                <label className="text-[13px] font-medium">Title</label>
                <input value={newPostForm.title} onChange={(e) => setNewPostForm((f) => ({ ...f, title: e.target.value }))} placeholder="What do you want to ask?" className="mt-[6px] w-full h-[42px] rounded-[8px] border border-[#E8E6E1] bg-white px-[12px] text-[14px] focus:outline-none focus:border-[#132E26]/40" />
              </div>

              <div className="mt-[14px]">
                <label className="text-[13px] font-medium">Details</label>
                <textarea value={newPostForm.content} onChange={(e) => setNewPostForm((f) => ({ ...f, content: e.target.value }))} placeholder="Add more context..." className="mt-[6px] w-full min-h-[110px] rounded-[8px] border border-[#E8E6E1] bg-[#F7F6F3] p-[12px] text-[14px] focus:outline-none focus:border-[#132E26]/30" />
              </div>

              <div className="mt-[16px] flex items-center justify-between rounded-[8px] bg-[#F7F6F3] border border-[#E8E6E1] px-[12px] h-[44px]">
                <span className="text-[13px]">Post anonymously</span>
                <button onClick={() => setNewPostForm((f) => ({ ...f, anon: !f.anon }))} className={`w-[40px] h-[22px] rounded-full p-[2px] transition ${newPostForm.anon ? "bg-[#132E26]" : "bg-[#D6D3CE]"}`}>
                  <span className={`block w-[18px] h-[18px] rounded-full bg-white transition-transform ${newPostForm.anon ? "translate-x-[18px]" : ""}`} />
                </button>
              </div>

              <button onClick={handleCreatePost} className="mt-[16px] w-full h-[42px] rounded-[8px] bg-[#132E26] text-white text-[14px] font-medium hover:bg-[#0F241E]">Post</button>
              <div className="mt-[10px] text-[11px] text-[#8A8A8A] text-center">Anonymous doesn't mean consequence-free. Be respectful.</div>
            </div>
          </div>
        )}

        {page === "search" && (
          <div className="pt-[16px] md:pt-[24px] max-w-[680px] mx-auto">
            <h1 className="text-[20px] font-semibold">Search AMU Hub</h1>
            <div className="mt-[12px] relative">
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus placeholder="Search AMU Hub..." className="w-full h-[44px] pl-[36px] pr-[12px] rounded-[10px] bg-white border border-[#E8E6E1] text-[15px] focus:outline-none focus:border-[#132E26]/30 shadow-[0_1px_2px_rgba(0,0,0,0.04)]" />
              <span className="absolute left-[12px] top-[11px] text-[#8A8A8A]">⌕</span>
            </div>
            <div className="mt-[12px] flex flex-wrap gap-[8px]">
              {RECENT_SEARCHES.map((s) => (
                <button key={s} onClick={() => setSearchQuery(s)} className="px-[10px] h-[28px] rounded-full bg-[#F7F6F3] border border-[#E8E6E1] text-[12px] text-[#4A4A4A] hover:border-[#D6D3CE]">{s}</button>
              ))}
            </div>

            <div className="mt-[20px]">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-[#6B6B6B]">Results {searchQuery ? `for "${searchQuery}"` : ""}</div>
              <div className="mt-[10px] flex flex-col gap-[10px]">
                {filteredPosts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
                {filteredPosts.length === 0 && <div className="text-[13px] text-[#6B6B6B]">No results. Try another keyword like hostel, scholarship, library.</div>}
              </div>
            </div>
          </div>
        )}

        {page === "messages" && (
          <div className="pt-[16px] md:pt-[24px] max-w-[900px] mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-[20px] font-semibold">Messages</h1>
              <span className="text-[11px] px-[8px] py-[3px] rounded-full bg-[#F7F6F3] border border-[#E8E6E1] text-[#6B6B6B]">Anonymous · Request-only</span>
            </div>

            {!dmEnabled && (
              <div className="mt-[12px] rounded-[10px] border border-[#E8E6E1] bg-[#FFF8E7] p-[12px] text-[12px] leading-[18px] text-[#6B4A00]">
                DMs are OFF by default. Enable in Profile → Settings to receive message requests. Both users remain anonymous.
              </div>
            )}

            <div className="mt-[14px] flex gap-[6px] p-[4px] rounded-[10px] bg-[#F7F6F3] border border-[#E8E6E1] w-fit">
              <button onClick={() => setMsgTab("requests")} className={`px-[14px] h-[30px] rounded-[7px] text-[13px] ${msgTab === "requests" ? "bg-white border border-[#E8E6E1] shadow-sm font-medium" : "text-[#6B6B6B]"}`}>Requests ({msgRequests.filter((r) => r.status === "pending").length})</button>
              <button onClick={() => setMsgTab("chats")} className={`px-[14px] h-[30px] rounded-[7px] text-[13px] ${msgTab === "chats" ? "bg-white border border-[#E8E6E1] shadow-sm font-medium" : "text-[#6B6B6B]"}`}>Chats ({msgRequests.filter((r) => r.status === "accepted").length})</button>
            </div>

            <div className="mt-[16px] grid md:grid-cols-[300px_1fr] gap-[12px]">
              <div className="rounded-[10px] border border-[#E8E6E1] bg-white p-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                {(msgTab === "requests" ? msgRequests.filter((r) => r.status === "pending") : msgRequests.filter((r) => r.status === "accepted")).length === 0 ? (
                  <div className="p-[14px] text-[13px] text-[#6B6B6B]">{msgTab === "requests" ? "No pending requests" : "No chats yet. Message an author from a post."}</div>
                ) : (
                  <div className="flex flex-col">
                    {(msgTab === "requests" ? msgRequests.filter((r) => r.status === "pending") : msgRequests.filter((r) => r.status === "accepted")).map((r) => (
                      <button key={r.id} onClick={() => setActiveChatId(r.id)} className={`text-left p-[10px] rounded-[8px] hover:bg-[#F7F6F3] ${activeChatId === r.id ? "bg-[#F7F6F3]" : ""}`}>
                        <div className="text-[13px] font-medium truncate">{r.from.username}</div>
                        <div className="text-[11px] text-[#8A8A8A] truncate">{r.postTitle}</div>
                        <div className="text-[11px] text-[#6B6B6B] mt-[2px] truncate">{r.messages[r.messages.length - 1]?.text}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[10px] border border-[#E8E6E1] bg-white min-h-[380px] flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                {activeChatId === null ? (
                  <div className="flex-1 flex items-center justify-center p-[20px] text-[13px] text-[#6B6B6B] text-center">
                    Select a conversation. <br /> Both users are anonymous to each other.
                  </div>
                ) : (
                  (() => {
                    const req = msgRequests.find((r) => r.id === activeChatId);
                    if (!req) return null;
                    return (
                      <>
                        <div className="px-[14px] h-[48px] border-b border-[#E8E6E1] flex items-center justify-between">
                          <div>
                            <div className="text-[13px] font-medium">{req.from.username}</div>
                            <div className="text-[11px] text-[#8A8A8A]">Regarding: {req.postTitle.slice(0, 42)}</div>
                          </div>
                          <div className="flex gap-[6px]">
                            {req.status === "pending" && (
                              <>
                                <button onClick={() => handleAccept(req.id)} className="h-[28px] px-[10px] rounded-[7px] bg-[#132E26] text-white text-[12px]">Accept</button>
                                <button onClick={() => handleDecline(req.id)} className="h-[28px] px-[10px] rounded-[7px] border border-[#E8E6E1] bg-white text-[12px]">Decline</button>
                              </>
                            )}
                            <button onClick={() => handleBlockUser(req.from.username)} className="h-[28px] px-[10px] rounded-[7px] border border-[#E8E6E1] text-[12px]">Block</button>
                          </div>
                        </div>
                        <div className="px-[12px] py-[10px] bg-[#F7F6F3] text-[11px] text-[#6B6B6B] text-center border-b border-[#E8E6E1]">Both users are anonymous to each other. Never share phone, address, or private info.</div>
                        <div className="flex-1 overflow-auto p-[12px] flex flex-col gap-[8px]">
                          {req.messages.map((m) => (
                            <div key={m.id} className={`max-w-[78%] rounded-[12px] px-[12px] py-[8px] text-[13px] leading-[18px] ${m.from === user?.username ? "bg-[#132E26] text-white ml-auto" : "bg-[#F3F1EC] border border-[#E8E6E1] text-[#111]"}`}>
                              {m.text}
                              <div className={`text-[10px] mt-[4px] ${m.from === user?.username ? "text-white/60" : "text-[#8A8A8A]"}`}>{m.time}</div>
                            </div>
                          ))}
                        </div>
                        {req.status === "accepted" ? (
                          <div className="p-[10px] border-t border-[#E8E6E1] flex gap-[8px]">
                            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendChat()} placeholder="Write a message..." className="flex-1 h-[36px] rounded-[8px] border border-[#E8E6E1] bg-[#F7F6F3] px-[12px] text-[13px] focus:outline-none" />
                            <button onClick={handleSendChat} className="h-[36px] px-[14px] rounded-[8px] bg-[#132E26] text-white text-[13px]">Send</button>
                          </div>
                        ) : (
                          <div className="p-[12px] text-[12px] text-[#6B6B6B] text-center border-t border-[#E8E6E1]">Accept request to start chatting</div>
                        )}
                      </>
                    );
                  })()
                )}
              </div>
            </div>

            <div className="mt-[14px] rounded-[10px] border border-[#E8E6E1] bg-white p-[12px] text-[11px] leading-[16px] text-[#8A8A8A]">
              Safety: DMs OFF by default · Message requests · Accept/Decline · Block · Report · Anti-spam rate limits. No voice/video, no image sharing, no read receipts in V1.
            </div>
          </div>
        )}

        {page === "profile" && (
          <div className="pt-[16px] md:pt-[24px] max-w-[720px] mx-auto">
            <div className="rounded-[12px] border border-[#E8E6E1] bg-white p-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex gap-[14px] items-start">
              <div className="w-[48px] h-[48px] rounded-full bg-[#F3F1EC] border border-[#E8E6E1] flex items-center justify-center text-[16px] font-medium">A</div>
              <div className="flex-1">
                <div className="text-[16px] font-semibold">{user?.username || "Anonymous"}</div>
                <div className="text-[13px] text-[#6B6B6B]">{user?.course || "Course not set"} {user?.course && user?.year ? "·" : ""} {user?.year || ""}</div>
                <div className="mt-[10px] flex gap-[6px] flex-wrap">
                  <span className="text-[11px] px-[8px] py-[3px] rounded-full bg-[#F7F6F3] border border-[#E8E6E1]">Anonymous identity</span>
                  <span className="text-[11px] px-[8px] py-[3px] rounded-full bg-[#F7F6F3] border border-[#E8E6E1]">No followers</span>
                </div>
              </div>
              <button onClick={() => { setUser(null); setPage("landing"); showToast("Logged out"); }} className="h-[32px] px-[12px] rounded-[8px] border border-[#E8E6E1] bg-white text-[13px]">Logout</button>
            </div>

            <div className="mt-[14px] flex gap-[6px] p-[4px] rounded-[10px] bg-[#F7F6F3] border border-[#E8E6E1] w-fit">
              {(["posts", "replies", "saved", "settings"] as const).map((t) => (
                <button key={t} onClick={() => setProfileTab(t)} className={`px-[12px] h-[30px] rounded-[7px] text-[13px] capitalize ${profileTab === t ? "bg-white border border-[#E8E6E1] shadow-sm font-medium" : "text-[#6B6B6B]"}`}>{t}</button>
              ))}
            </div>

            <div className="mt-[16px]">
              {profileTab === "posts" && (
                <div className="flex flex-col gap-[10px]">
                  {myPosts.length === 0 ? <div className="text-[13px] text-[#6B6B6B]">You haven't posted yet.</div> : myPosts.map((p) => <PostCard key={p.id} post={p} />)}
                </div>
              )}
              {profileTab === "replies" && (
                <div className="flex flex-col gap-[10px]">
                  {myRepliesCache.length === 0 ? <div className="text-[13px] text-[#6B6B6B]">No replies yet.</div> : myRepliesCache.map(({ postId, reply }) => {
                    const parent = posts.find((p) => p.id === postId);
                    return (
                      <div key={reply.id} className="rounded-[10px] border border-[#E8E6E1] bg-white p-[14px]">
                        <div className="text-[11px] text-[#8A8A8A]">Replied to: {parent?.title}</div>
                        <div className="text-[14px] mt-[6px]">{reply.content}</div>
                        <div className="text-[11px] text-[#8A8A8A] mt-[6px]">{reply.time}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              {profileTab === "saved" && (
                <div className="flex flex-col gap-[10px]">
                  {savedPosts.length === 0 ? <div className="text-[13px] text-[#6B6B6B]">No saved posts.</div> : savedPosts.map((p) => <PostCard key={p.id} post={p} />)}
                </div>
              )}
              {profileTab === "settings" && (
                <div className="rounded-[12px] border border-[#E8E6E1] bg-white p-[16px] shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col gap-[16px]">
                  <div className="grid md:grid-cols-2 gap-[12px]">
                    <div>
                      <label className="text-[12px] font-medium">Anonymous username</label>
                      <input value={user?.username || ""} onChange={(e) => setUser((u) => (u ? { ...u, username: e.target.value } : u))} className="mt-[6px] w-full h-[38px] rounded-[8px] border border-[#E8E6E1] px-[10px] text-[14px]" />
                    </div>
                    <div>
                      <label className="text-[12px] font-medium">Course</label>
                      <select value={user?.course || ""} onChange={(e) => setUser((u) => (u ? { ...u, course: e.target.value } : u))} className="mt-[6px] w-full h-[38px] rounded-[8px] border border-[#E8E6E1] px-[10px] text-[14px] bg-white">
                        <option value="">Select course</option>
                        <option>BCom</option><option>BBA</option><option>BSc</option><option>Engineering</option><option>BA</option><option>MA</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[12px] font-medium">Year</label>
                      <select value={user?.year || ""} onChange={(e) => setUser((u) => (u ? { ...u, year: e.target.value } : u))} className="mt-[6px] w-full h-[38px] rounded-[8px] border border-[#E8E6E1] px-[10px] text-[14px] bg-white">
                        <option value="">Select year</option>
                        <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-[#F0EEEA] pt-[14px] flex flex-col gap-[10px]">
                    <div className="flex items-center justify-between h-[40px]">
                      <div><div className="text-[13px] font-medium">Notifications</div><div className="text-[11px] text-[#8A8A8A]">Replies and requests</div></div>
                      <button onClick={() => setNotifEnabled(!notifEnabled)} className={`w-[40px] h-[22px] rounded-full p-[2px] ${notifEnabled ? "bg-[#132E26]" : "bg-[#D6D3CE]"}`}><span className={`block w-[18px] h-[18px] bg-white rounded-full transition-transform ${notifEnabled ? "translate-x-[18px]" : ""}`} /></button>
                    </div>
                    <div className="flex items-center justify-between h-[40px]">
                      <div><div className="text-[13px] font-medium">DMs</div><div className="text-[11px] text-[#8A8A8A]">OFF by default, request-only</div></div>
                      <button onClick={() => setDmEnabled(!dmEnabled)} className={`w-[40px] h-[22px] rounded-full p-[2px] ${dmEnabled ? "bg-[#132E26]" : "bg-[#D6D3CE]"}`}><span className={`block w-[18px] h-[18px] bg-white rounded-full transition-transform ${dmEnabled ? "translate-x-[18px]" : ""}`} /></button>
                    </div>
                  </div>

                  <div className="border-t border-[#F0EEEA] pt-[14px]">
                    <div className="text-[12px] font-semibold uppercase text-[#6B6B6B]">Blocked users</div>
                    <div className="mt-[8px] flex flex-wrap gap-[6px]">
                      {blockedUsers.length === 0 ? <span className="text-[12px] text-[#8A8A8A]">No blocked users</span> : blockedUsers.map((b) => (
                        <span key={b} className="px-[8px] py-[4px] rounded-full bg-[#F7F6F3] border border-[#E8E6E1] text-[12px] flex items-center gap-[6px]">{b} <button onClick={() => setBlockedUsers((prev) => prev.filter((x) => x !== b))} className="text-[#8A8A8A]">×</button></span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[#F0EEEA] pt-[14px]">
                    <div className="text-[12px] font-semibold uppercase text-[#6B6B6B]">Report history</div>
                    <div className="mt-[8px] text-[12px] text-[#8A8A8A]">No reports filed in this session. Reports are reviewed by moderators. Anonymous doesn't mean consequence-free.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAV */}
      {user && page !== "landing" && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E8E6E1] h-[64px] flex items-center justify-around px-[6px] pb-[env(safe-area-inset-bottom)]">
          <button onClick={() => setPage("home")} className={`flex flex-col items-center gap-[2px] ${page === "home" ? "text-[#111]" : "text-[#8A8A8A]"}`}><span className="text-[18px]">⌂</span><span className="text-[10px]">Home</span></button>
          <button onClick={() => setPage("search")} className={`flex flex-col items-center gap-[2px] ${page === "search" ? "text-[#111]" : "text-[#8A8A8A]"}`}><span className="text-[16px]">⌕</span><span className="text-[10px]">Search</span></button>
          <button onClick={() => setPage("create")} className="w-[44px] h-[44px] rounded-full bg-[#132E26] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(19,46,38,0.3)] -mt-[18px] text-[20px]">+</button>
          <button onClick={() => setPage("messages")} className={`flex flex-col items-center gap-[2px] ${page === "messages" ? "text-[#111]" : "text-[#8A8A8A]"}`}><span className="text-[16px]">✉</span><span className="text-[10px]">Messages</span></button>
          <button onClick={() => setPage("profile")} className={`flex flex-col items-center gap-[2px] ${page === "profile" ? "text-[#111]" : "text-[#8A8A8A]"}`}><span className="text-[16px]">○</span><span className="text-[10px]">Profile</span></button>
        </nav>
      )}

      {/* JOIN MODAL */}
      {showJoin && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={() => setShowJoin(false)} />
          <div className="relative w-full md:max-w-[420px] bg-white rounded-t-[16px] md:rounded-[14px] border border-[#E8E6E1] shadow-[0_16px_40px_rgba(0,0,0,0.12)] p-[20px] max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-semibold">Join anonymously</h2>
              <button onClick={() => setShowJoin(false)} className="w-[28px] h-[28px] rounded-full bg-[#F7F6F3] border border-[#E8E6E1]">×</button>
            </div>
            <p className="text-[13px] text-[#6B6B6B] mt-[8px] leading-[18px]">No real name required publicly. Course/year optional. Backend moderation for safety.</p>

            <div className="mt-[18px]">
              <label className="text-[12px] font-medium">Anonymous username</label>
              <div className="mt-[6px] flex gap-[8px]">
                <input value={joinForm.username} onChange={(e) => setJoinForm((f) => ({ ...f, username: e.target.value }))} className="flex-1 h-[40px] rounded-[8px] border border-[#E8E6E1] px-[12px] text-[14px] focus:outline-none focus:border-[#132E26]/30" />
                <button onClick={generateUsername} className="h-[40px] px-[12px] rounded-[8px] border border-[#E8E6E1] bg-[#F7F6F3] text-[13px] hover:bg-[#F3F1EC]">Generate</button>
              </div>
            </div>

            <div className="mt-[12px] grid grid-cols-2 gap-[10px]">
              <div>
                <label className="text-[12px] font-medium">Course (optional)</label>
                <select value={joinForm.course} onChange={(e) => setJoinForm((f) => ({ ...f, course: e.target.value }))} className="mt-[6px] w-full h-[40px] rounded-[8px] border border-[#E8E6E1] px-[10px] text-[14px] bg-white">
                  <option value="">Select</option>
                  <option>BCom</option><option>BBA</option><option>BSc</option><option>Engineering</option><option>BA</option><option>MA</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] font-medium">Year (optional)</label>
                <select value={joinForm.year} onChange={(e) => setJoinForm((f) => ({ ...f, year: e.target.value }))} className="mt-[6px] w-full h-[40px] rounded-[8px] border border-[#E8E6E1] px-[10px] text-[14px] bg-white">
                  <option value="">Select</option>
                  <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                </select>
              </div>
            </div>

            <label className="mt-[16px] flex gap-[10px] items-start rounded-[8px] border border-[#E8E6E1] bg-[#F7F6F3] p-[10px] cursor-pointer">
              <input type="checkbox" checked={joinForm.agreed} onChange={(e) => setJoinForm((f) => ({ ...f, agreed: e.target.checked }))} className="mt-[2px]" />
              <span className="text-[12px] leading-[16px] text-[#4A4A4A]"><span className="font-medium text-[#111]">Anonymous doesn't mean consequence-free.</span> Be respectful. Don't harass, threaten, expose private info, or spam. I agree to community rules.</span>
            </label>

            <button onClick={handleJoin} className="mt-[16px] w-full h-[42px] rounded-[8px] bg-[#132E26] text-white text-[14px] font-medium hover:bg-[#0F241E]">Create anonymous identity</button>
            <div className="mt-[10px] text-[11px] text-center text-[#8A8A8A]">Public profile shows only Anonymous + optional course/year. No phone/email.</div>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {reportTarget && (
        <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setReportTarget(null)} />
          <div className="relative w-full md:max-w-[400px] bg-white rounded-t-[16px] md:rounded-[14px] border border-[#E8E6E1] p-[18px] shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
            <h3 className="text-[15px] font-semibold">Report</h3>
            <p className="text-[12px] text-[#6B6B6B] mt-[4px]">Help keep AMU Hub safe. Anonymous doesn't mean consequence-free.</p>
            <div className="mt-[14px] flex flex-col gap-[6px]">
              {["Harassment", "Spam", "Threats", "Sexual/creepy behavior", "Hate/abuse", "Blackmail/extortion", "Sharing private information", "Other"].map((r) => (
                <button key={r} onClick={() => setReportReason(r)} className={`text-left px-[12px] py-[9px] rounded-[8px] border text-[13px] ${reportReason === r ? "bg-[#132E26] text-white border-[#132E26]" : "bg-[#F7F6F3] border-[#E8E6E1] hover:border-[#D6D3CE]"}`}>{r}</button>
              ))}
            </div>
            <div className="mt-[14px] flex gap-[8px]">
              <button onClick={() => setReportTarget(null)} className="flex-1 h-[38px] rounded-[8px] border border-[#E8E6E1] bg-white text-[13px]">Cancel</button>
              <button onClick={() => { if (!reportReason) { showToast("Select a reason"); return; } showToast(`Reported for ${reportReason}`); setReportTarget(null); setReportReason(""); }} className="flex-1 h-[38px] rounded-[8px] bg-[#132E26] text-white text-[13px]">Submit report</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-[84px] md:bottom-[20px] left-1/2 -translate-x-1/2 z-[80] bg-[#111] text-white text-[13px] px-[14px] py-[10px] rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;

