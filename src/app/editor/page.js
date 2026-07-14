"use client";
import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./editor.module.scss";
import { 
  FaSave, 
  FaGithub, 
  FaUpload, 
  FaPlus, 
  FaTrash, 
  FaMusic, 
  FaImage, 
  FaInfoCircle, 
  FaHeart, 
  FaSpinner,
  FaArrowLeft,
  FaQrcode,
  FaCog,
  FaGlobe,
  FaCopy,
  FaCalendarAlt,
  FaCheckCircle,
  FaDownload,
  FaLink,
  FaUsers
} from "react-icons/fa";

const cx = classNames.bind(styles);

export default function Editor() {
  const [activeTab, setActiveTab] = useState("general");
  const [gallerySubTab, setGallerySubTab] = useState("core");
  const [inviteSubTab, setInviteSubTab] = useState("single"); // 'single' | 'bulk'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gitSyncing, setGitSyncing] = useState(false);
  const [gitLogs, setGitLogs] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [config, setConfig] = useState(null);

  // States quản lý danh sách hình ảnh
  const [albumImages, setAlbumImages] = useState([]); // Core gallery images
  const [finalImages, setFinalImages] = useState([]); // Final images
  const [invitationImages, setInvitationImages] = useState([]); // Invitation section images
  const [brideSlideImages, setBrideSlideImages] = useState([]); // Bride slide images
  const [groomSlideImages, setGroomSlideImages] = useState([]); // Groom slide images

  // States cho tính năng tạo thiệp mời và QR
  const [invitationDomain, setInvitationDomain] = useState("https://thiep-cuoi-hung-thuy.vercel.app");
  const [guestName, setGuestName] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [bulkGuests, setBulkGuests] = useState([]);

  const [isLocal, setIsLocal] = useState(true);

  useEffect(() => {
    // Kiểm tra chạy ở localhost
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const localHost = hostname === "localhost" || hostname === "127.0.0.1";
      setIsLocal(localHost);
      if (localHost) {
        fetchConfig();
      }
    }
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/config");
      if (!res.ok) {
        throw new Error("Không thể tải API config");
      }
      const data = await res.json();
      setConfig(data);
      
      // Sync image list states
      setAlbumImages(data.albumSection?.images || []);
      setFinalImages(data.finalSection?.images || []);
      setInvitationImages(data.invitationSection?.imgs || []);
      setBrideSlideImages(data.profileSection?.profiles?.[0]?.images || []);
      setGroomSlideImages(data.profileSection?.profiles?.[1]?.images || []);

      // Sync invitation domain
      if (data.invitationDomain) {
        setInvitationDomain(data.invitationDomain);
      }
    } catch (err) {
      showError("Không thể kết nối API cấu hình: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setMessage({ type: "success", text: msg });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const showError = (msg) => {
    setMessage({ type: "error", text: msg });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      
      // Clone config và nhúng các danh sách ảnh hiện tại vào trước khi lưu
      const updatedConfig = JSON.parse(JSON.stringify(config));
      
      if (!updatedConfig.albumSection) updatedConfig.albumSection = {};
      updatedConfig.albumSection.images = albumImages;

      if (!updatedConfig.finalSection) updatedConfig.finalSection = {};
      updatedConfig.finalSection.images = finalImages;

      if (!updatedConfig.invitationSection) updatedConfig.invitationSection = {};
      updatedConfig.invitationSection.imgs = invitationImages;

      if (!updatedConfig.profileSection) updatedConfig.profileSection = {};
      if (!updatedConfig.profileSection.profiles) updatedConfig.profileSection.profiles = [{}, {}];
      if (!updatedConfig.profileSection.profiles[0]) updatedConfig.profileSection.profiles[0] = {};
      if (!updatedConfig.profileSection.profiles[1]) updatedConfig.profileSection.profiles[1] = {};
      
      updatedConfig.profileSection.profiles[0].images = brideSlideImages;
      updatedConfig.profileSection.profiles[1].images = groomSlideImages;

      // Save domain
      updatedConfig.invitationDomain = invitationDomain;

      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedConfig)
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess(data.message || "Đã lưu cấu hình thành công!");
        setConfig(updatedConfig);
      } else {
        showError("Lưu thất bại: " + (data.error || "Lỗi không xác định"));
      }
    } catch (err) {
      showError("Lỗi kết nối API: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFileDelete = async (url) => {
    if (!url) return;
    try {
      await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
    } catch (err) {
      console.error("Lỗi khi xóa file cũ:", err);
    }
  };

  const handleFileUpload = async (event, callback, type = "image", oldUrl = "") => {
    const file = event.target.files[0];
    if (!file) return;

    if (type === "audio" && !file.type.startsWith("audio/")) {
      showError("Chỉ chấp nhận file âm thanh (.mp3, .wav...)");
      return;
    }
    if (type === "image" && !file.type.startsWith("image/")) {
      showError("Chỉ chấp nhận file hình ảnh");
      return;
    }

    try {
      setMessage({ type: "info", text: `Đang tải lên tệp: ${file.name}...` });
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (oldUrl) {
          await handleFileDelete(oldUrl);
        }
        callback(data.url);
        showSuccess(`Tải lên tệp ${file.name} thành công!`);
      } else {
        showError("Tải lên thất bại: " + (data.error || "Lỗi không xác định"));
      }
    } catch (err) {
      showError("Lỗi tải lên: " + err.message);
    }
  };

  const handleGitSync = async () => {
    if (!confirm("Bạn có chắc chắn muốn đẩy tất cả cấu hình và ảnh lên GitHub ngay lập tức?")) {
      return;
    }
    try {
      setGitSyncing(true);
      setGitLogs(["Gửi yêu cầu đồng bộ GitHub... đang chuẩn bị..."]);
      
      // Tự động lưu cấu hình trước khi đẩy lên github
      await handleSave();

      const res = await fetch("/api/git", { method: "POST" });
      const data = await res.json();
      setGitLogs(data.logs || []);
      
      if (res.ok && data.success) {
        showSuccess("Đã đẩy code thành công lên GitHub!");
      } else {
        showError("Đồng bộ thất bại: " + (data.error || "Kiểm tra log console phía dưới"));
      }
    } catch (err) {
      setGitLogs(prev => [...prev, `Lỗi mạng: ${err.message}`]);
      showError("Lỗi đồng bộ GitHub: " + err.message);
    } finally {
      setGitSyncing(false);
    }
  };

  const setNestedVal = (path, value) => {
    setConfig(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      let current = copy;
      for (let i = 0; i < path.length - 1; i++) {
        if (current[path[i]] === undefined) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return copy;
    });
  };

  const handleDateChange = (dateString) => {
    if (!dateString) return;
    const daysOfWeek = [
      "Chủ nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy"
    ];
    const dateObj = new Date(dateString);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const dayOfWeek = daysOfWeek[dateObj.getDay()];

    const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}`;
    const formattedFull = `${dayOfWeek}, Ngày ${day} Tháng ${month} năm ${year}`;

    setConfig(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (!copy.weddingInfo) copy.weddingInfo = [{}];
      if (!copy.weddingInfo[0]) copy.weddingInfo[0] = {};
      if (!copy.weddingInfo[0].time) copy.weddingInfo[0].time = {};

      copy.weddingInfo[0].time.date = formattedDate;
      copy.weddingInfo[0].time.year = year.toString();
      copy.weddingInfo[0].time.full = formattedFull;

      // Cập nhật luôn cho bộ đếm ngược (timerSection)
      if (!copy.timerSection) copy.timerSection = {};
      if (!copy.timerSection.weddingTime) copy.timerSection.weddingTime = {};
      copy.timerSection.weddingTime.year = year;
      copy.timerSection.weddingTime.month = month;
      copy.timerSection.weddingTime.day = day;

      // Cập nhật ngày cưới được tô đậm trên lịch tháng (invitationSection)
      if (!copy.invitationSection) copy.invitationSection = {};
      copy.invitationSection.activeDay = day;

      return copy;
    });
  };

  const copyLogsToClipboard = () => {
    if (gitLogs.length === 0) return;
    const text = gitLogs.join("\n");
    navigator.clipboard.writeText(text);
    showSuccess("Đã sao chép nhật ký đồng bộ vào clipboard!");
  };

  // Helper tạo link khách mời
  const getGuestLink = (name) => {
    const cleanDomain = invitationDomain.endsWith("/") ? invitationDomain.slice(0, -1) : invitationDomain;
    return `${cleanDomain}/?name=${encodeURIComponent(name.trim())}`;
  };

  // Helper tạo URL ảnh QR Code từ API công khai
  const getQRCodeUrl = (link) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
  };

  // Tải tệp QR Code PNG về máy khách
  const handleDownloadQR = async (qrUrl, guestName) => {
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      const cleanName = guestName.trim().replace(/[^a-zA-Z0-9_\sÀ-ỹ]/g, "").replace(/\s+/g, "_");
      a.download = `QR_ThiepCuoi_${cleanName || "Khach"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      showError("Lỗi khi tải ảnh QR: " + err.message);
    }
  };

  // Tạo liên kết hàng loạt
  const handleBulkGenerate = () => {
    if (!bulkInput.trim()) {
      showError("Vui lòng nhập danh sách tên khách mời");
      return;
    }
    const lines = bulkInput.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const generatedList = lines.map((name, idx) => {
      const link = getGuestLink(name);
      const qr = getQRCodeUrl(link);
      return { id: idx + 1, name, link, qr };
    });
    setBulkGuests(generatedList);
    showSuccess(`Đã tạo liên kết thành công cho ${generatedList.length} khách mời!`);
  };

  // Tải xuống toàn bộ QR Code (hàng loạt)
  const handleDownloadAllQRs = async () => {
    if (bulkGuests.length === 0) return;
    showSuccess("Đang tiến hành tải xuống hàng loạt... Vui lòng đồng ý khi trình duyệt yêu cầu tải nhiều tệp.");
    for (let i = 0; i < bulkGuests.length; i++) {
      const guest = bulkGuests[i];
      await handleDownloadQR(guest.qr, guest.name);
      // Tránh browser block download
      await new Promise(r => setTimeout(r, 600));
    }
  };

  // Sao chép nhanh liên kết khách mời
  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    showSuccess("Đã sao chép liên kết mời cưới!");
  };

  if (!isLocal) {
    return (
      <div className={cx("editor-container")} style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ background: "#131522", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "48px 40px", maxWidth: "600px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
          <h1 style={{ background: "linear-gradient(135deg, #a5b4fc 0%, #f472b6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "2rem", fontWeight: "800", marginBottom: "20px" }}>
            Trình Chỉnh Sửa Bảo Mật <FaHeart style={{ color: "#f472b6" }} />
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: "1.7", marginBottom: "32px" }}>
            Để bảo mật thông tin và quyền riêng tư của bạn, <strong>Trình Chỉnh Sửa (Editor)</strong> chỉ hoạt động ngoại tuyến dưới máy tính cá nhân (Localhost).
          </p>
          <div style={{ background: "rgba(165, 180, 252, 0.04)", border: "1px solid rgba(165, 180, 252, 0.12)", borderRadius: "16px", padding: "20px 24px", marginBottom: "32px", color: "#a5b4fc", fontSize: "0.95rem" }}>
            <strong style={{ display: "block", marginBottom: "10px", fontSize: "1.05rem" }}>👉 Hướng dẫn chỉnh sửa:</strong>
            <ol style={{ textAlign: "left", margin: "0", paddingLeft: "20px", lineHeight: "1.6" }}>
              <li style={{ marginBottom: "8px" }}>Mở Terminal trên máy tính của bạn ở thư mục dự án.</li>
              <li style={{ marginBottom: "8px" }}>Chạy lệnh: <code style={{ background: "rgba(0,0,0,0.4)", padding: "2px 6px", borderRadius: "4px", color: "#f43f5e" }}>npm run dev</code></li>
              <li>Truy cập địa chỉ: <a href="http://localhost:3000/editor" style={{ color: "#38bdf8", textDecoration: "underline", fontWeight: "bold" }}>http://localhost:3000/editor</a> để chỉnh sửa và tự động đẩy lên GitHub.</li>
            </ol>
          </div>
          <a href="./" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#a5b4fc", color: "#1e1b4b", padding: "12px 32px", borderRadius: "24px", textDecoration: "none", fontWeight: "700", boxShadow: "0 4px 14px rgba(165, 180, 252, 0.3)", transition: "all 0.2s" }}>
            <FaArrowLeft /> Quay lại xem Thiệp cưới
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={cx("loading-screen")}>
        <FaSpinner className={cx("spinner")} />
        <p style={{ fontWeight: 500, letterSpacing: "0.5px" }}>Đang tải cấu hình thiệp cưới...</p>
      </div>
    );
  }

  return (
    <div className={cx("editor-container")}>
      <header className={cx("editor-header")}>
        <div className={cx("header-left")}>
          <a href="/" className={cx("back-btn")}>
            <FaArrowLeft /> Xem Thiệp
          </a>
          <h1>Trình Chỉnh Sửa Thiệp Cưới <FaHeart className={cx("heart-icon")} /></h1>
        </div>
        <div className={cx("actions")}>
          <button onClick={handleSave} className={cx("save-btn")} disabled={saving}>
            {saving ? <FaSpinner className={cx("spinner")} /> : <FaSave />} {saving ? "Đang lưu..." : "Lưu cấu hình"}
          </button>
          <button onClick={handleGitSync} className={cx("git-btn")} disabled={gitSyncing}>
            {gitSyncing ? <FaSpinner className={cx("spinner")} /> : <FaGithub />} Đẩy lên GitHub
          </button>
        </div>
      </header>

      {message.text && (
        <div className={cx("global-message", message.type)}>
          {message.type === "success" && <FaCheckCircle />}
          {message.type === "loading" && <FaSpinner className={cx("spinner")} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className={cx("editor-layout")}>
        {/* Navigation Rail M3 */}
        <aside className={cx("sidebar")}>
          <button 
            className={cx("tab-btn", activeTab === "general" && "active")}
            onClick={() => setActiveTab("general")}
          >
            <FaInfoCircle /> Thông tin chung
          </button>
          <button 
            className={cx("tab-btn", activeTab === "profiles" && "active")}
            onClick={() => setActiveTab("profiles")}
          >
            <FaHeart /> Cô dâu & Chú rể
          </button>
          <button 
            className={cx("tab-btn", activeTab === "banking" && "active")}
            onClick={() => setActiveTab("banking")}
          >
            <FaQrcode /> Tài khoản & QR
          </button>
          <button 
            className={cx("tab-btn", activeTab === "gallery" && "active")}
            onClick={() => setActiveTab("gallery")}
          >
            <FaImage /> Thư viện & Nhạc
          </button>
          <button 
            className={cx("tab-btn", activeTab === "invite" && "active")}
            onClick={() => setActiveTab("invite")}
          >
            <FaQrcode /> Tạo Link & QR Mời
          </button>
          <button 
            className={cx("tab-btn", activeTab === "seo" && "active")}
            onClick={() => setActiveTab("seo")}
          >
            <FaGlobe /> Cấu hình SEO
          </button>
          <button 
            className={cx("tab-btn", activeTab === "github" && "active")}
            onClick={() => setActiveTab("github")}
          >
            <FaGithub /> Đồng bộ GitHub logs
          </button>
        </aside>

        {/* Form Content Areas */}
        <main className={cx("form-content")}>
          {/* TAB 1: GENERAL INFO */}
          {activeTab === "general" && (
            <div className={cx("panel")}>
              <h2><FaInfoCircle /> Thông tin chung Thiệp cưới</h2>
              
              <div className={cx("field")} style={{ marginBottom: "12px" }}>
                <label><FaCalendarAlt /> Chọn Ngày Làm Lễ (Bộ chọn lịch tự động điền các ô dưới)</label>
                <input 
                  type="date" 
                  onChange={(e) => handleDateChange(e.target.value)}
                />
                <span className={cx("helper-text")}>Chọn ngày lịch ở đây để tự động tính thứ, ngày tháng năm cho các phần đếm ngược và văn bản.</span>
              </div>

              <hr className={cx("divider")} />

              <div className={cx("nested-grid")}>
                <div className={cx("field")}>
                  <label>Ngày làm lễ (Văn bản)</label>
                  <input 
                    type="text" 
                    placeholder="Chọn ngày ở trên để tự động điền"
                    value={config.weddingInfo?.[0]?.time?.date || ""} 
                    onChange={(e) => setNestedVal(["weddingInfo", 0, "time", "date"], e.target.value)}
                  />
                </div>
                <div className={cx("field")}>
                  <label>Năm tổ chức</label>
                  <input 
                    type="text" 
                    placeholder="Chọn ngày ở trên để tự động điền"
                    value={config.weddingInfo?.[0]?.time?.year || ""} 
                    onChange={(e) => setNestedVal(["weddingInfo", 0, "time", "year"], e.target.value)}
                  />
                </div>
                <div className={cx("field")}>
                  <label>Giờ chính thức</label>
                  <input 
                    type="text" 
                    placeholder="Vd: 11:00"
                    value={config.weddingInfo?.[0]?.time?.time || ""} 
                    onChange={(e) => setNestedVal(["weddingInfo", 0, "time", "time"], e.target.value)}
                  />
                </div>
                <div className={cx("field")}>
                  <label>Ngày tô đậm trên lịch (Active Day)</label>
                  <input 
                    type="number" 
                    placeholder="Vd: 22"
                    value={config.invitationSection?.activeDay || ""} 
                    onChange={(e) => setNestedVal(["invitationSection", "activeDay"], parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className={cx("field")}>
                  <label>Chữ cái viết tắt Cô dâu</label>
                  <input 
                    type="text" 
                    maxLength="1"
                    placeholder="Vd: T"
                    value={config.introSection?.brideFirstLetter || ""} 
                    onChange={(e) => setNestedVal(["introSection", "brideFirstLetter"], e.target.value)}
                  />
                </div>
                <div className={cx("field")}>
                  <label>Chữ cái viết tắt Chú rể</label>
                  <input 
                    type="text" 
                    maxLength="1"
                    placeholder="Vd: H"
                    value={config.introSection?.groomFirstLetter || ""} 
                    onChange={(e) => setNestedVal(["introSection", "groomFirstLetter"], e.target.value)}
                  />
                </div>
              </div>

              <div className={cx("field")} style={{ marginTop: "12px" }}>
                <label>Văn bản ngày giờ đầy đủ</label>
                <input 
                  type="text" 
                  placeholder="Chọn ngày ở trên để tự động điền"
                  value={config.weddingInfo?.[0]?.time?.full || ""} 
                  onChange={(e) => setNestedVal(["weddingInfo", 0, "time", "full"], e.target.value)}
                />
              </div>

              <div className={cx("field")}>
                <label>Địa chỉ tổ chức hôn lễ</label>
                <input 
                  type="text" 
                  placeholder="Địa chỉ ghi trên thiệp"
                  value={config.weddingInfo?.[0]?.address || ""} 
                  onChange={(e) => setNestedVal(["weddingInfo", 0, "address"], e.target.value)}
                />
              </div>

              <div className={cx("field")}>
                <label>Tuyến đường/Chi tiết địa chỉ</label>
                <input 
                  type="text" 
                  placeholder="Vd: Tổ 23A, xã Tân Lập..."
                  value={config.weddingInfo?.[0]?.street || ""} 
                  onChange={(e) => setNestedVal(["weddingInfo", 0, "street"], e.target.value)}
                />
              </div>

              <div className={cx("field")}>
                <label>Số điện thoại liên hệ chính</label>
                <input 
                  type="text" 
                  placeholder="Vd: 0375..."
                  value={config.weddingInfo?.[0]?.phone || ""} 
                  onChange={(e) => setNestedVal(["weddingInfo", 0, "phone"], e.target.value)}
                />
              </div>

              <div className={cx("field")}>
                <label>Ảnh bìa mở màn (Intro Banner)</label>
                <div className={cx("file-upload-block")}>
                  <input 
                    type="text" 
                    placeholder="Đường dẫn ảnh hoặc tải lên..." 
                    value={config.introSection?.mainImage || ""} 
                    onChange={(e) => setNestedVal(["introSection", "mainImage"], e.target.value)}
                  />
                  <label className={cx("upload-label")}>
                    <FaUpload /> Chọn tệp
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["introSection", "mainImage"], url), "image", config.introSection?.mainImage)}
                    />
                  </label>
                </div>
                {config.introSection?.mainImage && (
                  <img src={config.introSection.mainImage} className={cx("preview-thumbnail")} alt="Intro Banner" />
                )}
              </div>
            </div>
          )}

          {/* TAB 2: COUPLES & SLIDES */}
          {activeTab === "profiles" && (
            <div className={cx("panel")}>
              <h2><FaHeart /> Thông tin Cô dâu & Chú rể</h2>
              
              <div className={cx("field")}>
                <label>Lời ngỏ / Mô tả ngắn cặp đôi</label>
                <textarea 
                  rows="3"
                  placeholder="Nhập châm ngôn cuộc sống hoặc lời cảm ơn khách mời..."
                  value={config.profileSection?.description || ""} 
                  onChange={(e) => setNestedVal(["profileSection", "description"], e.target.value)}
                />
              </div>

              <hr className={cx("divider")} />

              {/* Cô dâu Card */}
              <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "14px", padding: "24px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#f472b6" }}>👰 Hồ sơ Cô Dâu (Bride)</h3>
                <div className={cx("nested-grid")}>
                  <div className={cx("field")}>
                    <label>Tên Cô dâu</label>
                    <input 
                      type="text" 
                      value={config.profileSection?.profiles?.[0]?.name || ""} 
                      onChange={(e) => setNestedVal(["profileSection", "profiles", 0, "name"], e.target.value)}
                    />
                  </div>
                  <div className={cx("field")}>
                    <label>Ảnh đại diện Cô dâu (Avatar)</label>
                    <div className={cx("file-upload-block")}>
                      <input 
                        type="text" 
                        value={config.profileSection?.profiles?.[0]?.avatar || ""} 
                        onChange={(e) => setNestedVal(["profileSection", "profiles", 0, "avatar"], e.target.value)}
                      />
                      <label className={cx("upload-label")}>
                        <FaUpload /> Chọn tệp
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["profileSection", "profiles", 0, "avatar"], url), "image", config.profileSection?.profiles?.[0]?.avatar)}
                        />
                      </label>
                    </div>
                    {config.profileSection?.profiles?.[0]?.avatar && (
                      <img src={config.profileSection.profiles[0].avatar} className={cx("preview-thumbnail")} style={{ width: "90px", height: "90px", borderRadius: "50%" }} alt="Bride Avatar" />
                    )}
                  </div>
                </div>

                <div className={cx("field")} style={{ marginTop: "20px" }}>
                  <label>Album Slide Ảnh Cô dâu (Hình ảnh trượt giới thiệu)</label>
                  <div className={cx("gallery-row")}>
                    {brideSlideImages.map((img, idx) => (
                      <div key={idx} className={cx("gallery-item")}>
                        <img src={img} alt={`Bride Slide ${idx}`} />
                        <button 
                          className={cx("delete-icon-btn")}
                          onClick={async () => {
                            await handleFileDelete(img);
                            setBrideSlideImages(prev => prev.filter((_, i) => i !== idx));
                          }}
                          title="Xóa ảnh"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <label className={cx("add-image-box")}>
                      <FaPlus /> Thêm ảnh
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: "none" }}
                        onChange={(e) => handleFileUpload(e, (url) => setBrideSlideImages(prev => [...prev, url]))}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Chú rể Card */}
              <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "14px", padding: "24px" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#60a5fa" }}>🤵 Hồ sơ Chú Rể (Groom)</h3>
                <div className={cx("nested-grid")}>
                  <div className={cx("field")}>
                    <label>Tên Chú rể</label>
                    <input 
                      type="text" 
                      value={config.profileSection?.profiles?.[1]?.name || ""} 
                      onChange={(e) => setNestedVal(["profileSection", "profiles", 1, "name"], e.target.value)}
                    />
                  </div>
                  <div className={cx("field")}>
                    <label>Ảnh đại diện Chú rể (Avatar)</label>
                    <div className={cx("file-upload-block")}>
                      <input 
                        type="text" 
                        value={config.profileSection?.profiles?.[1]?.avatar || ""} 
                        onChange={(e) => setNestedVal(["profileSection", "profiles", 1, "avatar"], e.target.value)}
                      />
                      <label className={cx("upload-label")}>
                        <FaUpload /> Chọn tệp
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["profileSection", "profiles", 1, "avatar"], url), "image", config.profileSection?.profiles?.[1]?.avatar)}
                        />
                      </label>
                    </div>
                    {config.profileSection?.profiles?.[1]?.avatar && (
                      <img src={config.profileSection.profiles[1].avatar} className={cx("preview-thumbnail")} style={{ width: "90px", height: "90px", borderRadius: "50%" }} alt="Groom Avatar" />
                    )}
                  </div>
                </div>

                <div className={cx("field")} style={{ marginTop: "20px" }}>
                  <label>Album Slide Ảnh Chú rể (Hình ảnh trượt giới thiệu)</label>
                  <div className={cx("gallery-row")}>
                    {groomSlideImages.map((img, idx) => (
                      <div key={idx} className={cx("gallery-item")}>
                        <img src={img} alt={`Groom Slide ${idx}`} />
                        <button 
                          className={cx("delete-icon-btn")}
                          onClick={async () => {
                            await handleFileDelete(img);
                            setGroomSlideImages(prev => prev.filter((_, i) => i !== idx));
                          }}
                          title="Xóa ảnh"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <label className={cx("add-image-box")}>
                      <FaPlus /> Thêm ảnh
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: "none" }}
                        onChange={(e) => handleFileUpload(e, (url) => setGroomSlideImages(prev => [...prev, url]))}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BANKING & QR */}
          {activeTab === "banking" && (
            <div className={cx("panel")}>
              <h2><FaQrcode /> Tài khoản ngân hàng & QR mừng cưới</h2>
              
              <div className={cx("field")} style={{ marginBottom: "16px" }}>
                <label>Ảnh biểu trưng phần Mừng cưới (Gift Section Banner)</label>
                <div className={cx("file-upload-block")}>
                  <input 
                    type="text" 
                    value={config.giftSection?.image || ""}
                    onChange={(e) => setNestedVal(["giftSection", "image"], e.target.value)}
                  />
                  <label className={cx("upload-label")}>
                    <FaUpload /> Chọn tệp
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["giftSection", "image"], url), "image", config.giftSection?.image)}
                    />
                  </label>
                </div>
                {config.giftSection?.image && (
                  <img src={config.giftSection.image} className={cx("preview-thumbnail")} alt="Gift Section Banner" />
                )}
              </div>

              <div className={cx("bank-grid")}>
                {/* Bank Cô dâu */}
                <div className={cx("bank-card")}>
                  <h3>👰 Quỹ mừng Cô Dâu</h3>
                  <div className={cx("field")}>
                    <label>Chủ tài khoản</label>
                    <input 
                      type="text" 
                      value={config.giftSection?.brideBank?.name || ""} 
                      onChange={(e) => setNestedVal(["giftSection", "brideBank", "name"], e.target.value)}
                    />
                  </div>
                  <div className={cx("field")}>
                    <label>Ngân hàng</label>
                    <input 
                      type="text" 
                      value={config.giftSection?.brideBank?.bankName || ""} 
                      onChange={(e) => setNestedVal(["giftSection", "brideBank", "bankName"], e.target.value)}
                    />
                  </div>
                  <div className={cx("field")}>
                    <label>Số tài khoản</label>
                    <input 
                      type="text" 
                      value={config.giftSection?.brideBank?.bankNumber || ""} 
                      onChange={(e) => setNestedVal(["giftSection", "brideBank", "bankNumber"], e.target.value)}
                    />
                  </div>
                  <div className={cx("field")}>
                    <label>QR Code mừng cưới</label>
                    <div className={cx("file-upload-block")}>
                      <input 
                        type="text" 
                        placeholder="Để trống nếu dùng mặc định"
                        value={config.giftSection?.brideBank?.qr || ""} 
                        onChange={(e) => setNestedVal(["giftSection", "brideBank", "qr"], e.target.value)}
                      />
                      <label className={cx("upload-label")}>
                        <FaUpload /> Tải
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["giftSection", "brideBank", "qr"], url), "image", config.giftSection?.brideBank?.qr)}
                        />
                      </label>
                    </div>
                    {config.giftSection?.brideBank?.qr && (
                      <img src={config.giftSection.brideBank.qr} className={cx("preview-thumbnail")} style={{ maxHeight: "140px", objectFit: "contain" }} alt="Bride QR" />
                    )}
                  </div>
                </div>

                {/* Bank Chú rể */}
                <div className={cx("bank-card")}>
                  <h3>🤵 Quỹ mừng Chú Rể</h3>
                  <div className={cx("field")}>
                    <label>Chủ tài khoản</label>
                    <input 
                      type="text" 
                      value={config.giftSection?.groomBank?.name || ""} 
                      onChange={(e) => setNestedVal(["giftSection", "groomBank", "name"], e.target.value)}
                    />
                  </div>
                  <div className={cx("field")}>
                    <label>Ngân hàng</label>
                    <input 
                      type="text" 
                      value={config.giftSection?.groomBank?.bankName || ""} 
                      onChange={(e) => setNestedVal(["giftSection", "groomBank", "bankName"], e.target.value)}
                    />
                  </div>
                  <div className={cx("field")}>
                    <label>Số tài khoản</label>
                    <input 
                      type="text" 
                      value={config.giftSection?.groomBank?.bankNumber || ""} 
                      onChange={(e) => setNestedVal(["giftSection", "groomBank", "bankNumber"], e.target.value)}
                    />
                  </div>
                  <div className={cx("field")}>
                    <label>QR Code mừng cưới</label>
                    <div className={cx("file-upload-block")}>
                      <input 
                        type="text" 
                        placeholder="Để trống nếu dùng mặc định"
                        value={config.giftSection?.groomBank?.qr || ""} 
                        onChange={(e) => setNestedVal(["giftSection", "groomBank", "qr"], e.target.value)}
                      />
                      <label className={cx("upload-label")}>
                        <FaUpload /> Tải
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["giftSection", "groomBank", "qr"], url), "image", config.giftSection?.groomBank?.qr)}
                        />
                      </label>
                    </div>
                    {config.giftSection?.groomBank?.qr && (
                      <img src={config.giftSection.groomBank.qr} className={cx("preview-thumbnail")} style={{ maxHeight: "140px", objectFit: "contain" }} alt="Groom QR" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GALLERY & MUSIC */}
          {activeTab === "gallery" && (
            <div className={cx("panel")}>
              <h2><FaImage /> Quản lý Thư viện Ảnh & Nhạc nền</h2>

              {/* Sub-navigation for different image sections */}
              <div className={cx("subtabs-container")}>
                <button 
                  className={cx("subtab-btn", gallerySubTab === "core" && "active")}
                  onClick={() => setGallerySubTab("core")}
                >
                  Album trang chính
                </button>
                <button 
                  className={cx("subtab-btn", gallerySubTab === "final" && "active")}
                  onClick={() => setGallerySubTab("final")}
                >
                  Ảnh kết thúc thiệp
                </button>
                <button 
                  className={cx("subtab-btn", gallerySubTab === "invitation" && "active")}
                  onClick={() => setGallerySubTab("invitation")}
                >
                  Lịch & Thiệp mời
                </button>
                <button 
                  className={cx("subtab-btn", gallerySubTab === "albumPage" && "active")}
                  onClick={() => setGallerySubTab("albumPage")}
                >
                  Ảnh bìa trang Album
                </button>
                <button 
                  className={cx("subtab-btn", gallerySubTab === "guestbook" && "active")}
                  onClick={() => setGallerySubTab("guestbook")}
                >
                  Ảnh khối Lưu bút
                </button>
              </div>

              {/* Core Gallery images */}
              {gallerySubTab === "core" && (
                <div>
                  <h3 style={{ margin: "0 0 10px 0" }}>Bộ sưu tập Ảnh Cưới Trang Chính ({albumImages.length} ảnh)</h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "0 0 16px 0" }}>Các hình ảnh hiển thị ở khối Grid chính giữa thiệp cưới.</p>
                  <div className={cx("gallery-row")}>
                    {albumImages.map((img, idx) => (
                      <div key={idx} className={cx("gallery-item")}>
                        <img src={img} alt={`Album core ${idx}`} />
                        <button 
                          className={cx("delete-icon-btn")}
                          onClick={async () => {
                            await handleFileDelete(img);
                            setAlbumImages(prev => prev.filter((_, i) => i !== idx));
                          }}
                          title="Xóa ảnh"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <label className={cx("add-image-box")}>
                      <FaPlus /> Thêm ảnh
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: "none" }}
                        onChange={(e) => handleFileUpload(e, (url) => setAlbumImages(prev => [...prev, url]))}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Final images */}
              {gallerySubTab === "final" && (
                <div>
                  <h3 style={{ margin: "0 0 10px 0" }}>Ảnh cảm ơn ở chân trang ({finalImages.length} ảnh)</h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "0 0 16px 0" }}>Các hình ảnh hiển thị ở khối cuối cùng thay lời cảm ơn gửi đến khách mời.</p>
                  <div className={cx("gallery-row")}>
                    {finalImages.map((img, idx) => (
                      <div key={idx} className={cx("gallery-item")}>
                        <img src={img} alt={`Album final ${idx}`} />
                        <button 
                          className={cx("delete-icon-btn")}
                          onClick={async () => {
                            await handleFileDelete(img);
                            setFinalImages(prev => prev.filter((_, i) => i !== idx));
                          }}
                          title="Xóa ảnh"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <label className={cx("add-image-box")}>
                      <FaPlus /> Thêm ảnh
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: "none" }}
                        onChange={(e) => handleFileUpload(e, (url) => setFinalImages(prev => [...prev, url]))}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Invitation images */}
              {gallerySubTab === "invitation" && (
                <div>
                  <h3 style={{ margin: "0 0 10px 0" }}>Ảnh khu vực thiệp mời ({invitationImages.length} ảnh)</h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "0 0 16px 0" }}>Các hình ảnh hiển thị kèm trong khối thông tin lịch chi tiết tiệc cưới.</p>
                  <div className={cx("gallery-row")}>
                    {invitationImages.map((img, idx) => (
                      <div key={idx} className={cx("gallery-item")}>
                        <img src={img} alt={`Album invitation ${idx}`} />
                        <button 
                          className={cx("delete-icon-btn")}
                          onClick={async () => {
                            await handleFileDelete(img);
                            setInvitationImages(prev => prev.filter((_, i) => i !== idx));
                          }}
                          title="Xóa ảnh"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <label className={cx("add-image-box")}>
                      <FaPlus /> Thêm ảnh
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: "none" }}
                        onChange={(e) => handleFileUpload(e, (url) => setInvitationImages(prev => [...prev, url]))}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Album page cover images */}
              {gallerySubTab === "albumPage" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h3 style={{ margin: "0" }}>Ảnh nền trang Album chi tiết (Album Details Page Covers)</h3>
                  
                  <div className={cx("field")}>
                    <label>Ảnh bìa chính giữa trang (Main Center Cover)</label>
                    <div className={cx("file-upload-block")}>
                      <input 
                        type="text" 
                        value={config.albumPage?.mainImage || ""}
                        onChange={(e) => setNestedVal(["albumPage", "mainImage"], e.target.value)}
                      />
                      <label className={cx("upload-label")}>
                        <FaUpload /> Tải ảnh
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["albumPage", "mainImage"], url), "image", config.albumPage?.mainImage)}
                        />
                      </label>
                    </div>
                    {config.albumPage?.mainImage && (
                      <img src={config.albumPage.mainImage} className={cx("preview-thumbnail")} alt="Album Main" />
                    )}
                  </div>

                  <div className={cx("field")}>
                    <label>Ảnh bìa đỉnh trang (Top Header Cover)</label>
                    <div className={cx("file-upload-block")}>
                      <input 
                        type="text" 
                        value={config.albumPage?.topImage || ""}
                        onChange={(e) => setNestedVal(["albumPage", "topImage"], e.target.value)}
                      />
                      <label className={cx("upload-label")}>
                        <FaUpload /> Tải ảnh
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["albumPage", "topImage"], url), "image", config.albumPage?.topImage)}
                        />
                      </label>
                    </div>
                    {config.albumPage?.topImage && (
                      <img src={config.albumPage.topImage} className={cx("preview-thumbnail")} alt="Album Top" />
                    )}
                  </div>

                  <div className={cx("field")}>
                    <label>Ảnh bìa chân trang (Bottom Footer Cover)</label>
                    <div className={cx("file-upload-block")}>
                      <input 
                        type="text" 
                        value={config.albumPage?.bottomImage || ""}
                        onChange={(e) => setNestedVal(["albumPage", "bottomImage"], e.target.value)}
                      />
                      <label className={cx("upload-label")}>
                        <FaUpload /> Tải ảnh
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["albumPage", "bottomImage"], url), "image", config.albumPage?.bottomImage)}
                        />
                      </label>
                    </div>
                    {config.albumPage?.bottomImage && (
                      <img src={config.albumPage.bottomImage} className={cx("preview-thumbnail")} alt="Album Bottom" />
                    )}
                  </div>
                </div>
              )}

              {/* Guestbook section cover */}
              {gallerySubTab === "guestbook" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h3 style={{ margin: "0" }}>Ảnh đại diện khối Sổ Lưu Bút (Guestbook Cover Image)</h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "0" }}>Tấm ảnh hiển thị ở khối Lưu bút trên trang chủ (bức ảnh nụ hôn ngọt ngào).</p>
                  
                  <div className={cx("field")}>
                    <label>Ảnh hiển thị khối Lưu bút</label>
                    <div className={cx("file-upload-block")}>
                      <input 
                        type="text" 
                        value={config.guestbookSection?.image || ""}
                        onChange={(e) => setNestedVal(["guestbookSection", "image"], e.target.value)}
                      />
                      <label className={cx("upload-label")}>
                        <FaUpload /> Tải ảnh
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["guestbookSection", "image"], url), "image", config.guestbookSection?.image)}
                        />
                      </label>
                    </div>
                    {config.guestbookSection?.image && (
                      <img src={config.guestbookSection.image} className={cx("preview-thumbnail")} alt="Guestbook Cover" />
                    )}
                  </div>

                  <div className={cx("field")}>
                    <label>Ngày kỷ niệm hiển thị trên Lưu bút (Văn bản)</label>
                    <input 
                      type="text" 
                      placeholder="Vd: 12/12/2024"
                      value={config.guestbookSection?.time || ""}
                      onChange={(e) => setNestedVal(["guestbookSection", "time"], e.target.value)}
                    />
                  </div>
                </div>
              )}

              <hr className={cx("divider")} />

              {/* Music Configuration */}
              <div className={cx("music-uploader-card")}>
                <h3><FaMusic /> Cấu hình Nhạc Nền Tự Động</h3>
                <p className={cx("description")}>Tải lên file nhạc hạnh phúc của bạn (.mp3). Nếu để trống, hệ thống tự động phát bài hát mặc định của thiệp cưới.</p>
                <div className={cx("file-upload-block")}>
                  <input 
                    type="text" 
                    placeholder="Đường dẫn file nhạc hoặc tải lên..." 
                    value={config.musicUrl || ""} 
                    onChange={(e) => setNestedVal(["musicUrl"], e.target.value)}
                  />
                  <label className={cx("upload-label")}>
                    <FaUpload /> Tải tệp MP3
                    <input 
                      type="file" 
                      accept="audio/mp3, audio/*" 
                      onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["musicUrl"], url), "audio", config.musicUrl)}
                    />
                  </label>
                </div>
                {config.musicUrl && (
                  <div className={cx("audio-player-preview")}>
                    <audio src={config.musicUrl} controls className={cx("player")} />
                    <button 
                      className={cx("remove-music-btn")}
                      onClick={async () => {
                        await handleFileDelete(config.musicUrl);
                        setNestedVal(["musicUrl"], "");
                      }}
                    >
                      Xóa nhạc tùy chỉnh (dùng mặc định)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: INVITATION LINKS & QR GENERATOR */}
          {activeTab === "invite" && (
            <div className={cx("panel")}>
              <h2><FaQrcode /> Tạo liên kết & Mã QR Mời Khách</h2>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "20px" }}>
                Nhập tên khách mời để tạo đường dẫn cá nhân hóa. Khi khách mở liên kết, tên của họ sẽ xuất hiện trang trọng trên tiêu đề và nội dung thiệp mời.
              </p>

              <div className={cx("field")} style={{ marginBottom: "20px" }}>
                <label><FaGlobe /> Tên miền / URL public của thiệp cưới</label>
                <input 
                  type="text" 
                  placeholder="Vd: https://thiep-cuoi-hung-thuy.vercel.app"
                  value={invitationDomain}
                  onChange={(e) => setInvitationDomain(e.target.value)}
                />
                <span className={cx("helper-text")}>Địa chỉ website thực tế sau khi bạn đẩy code và triển khai trực tuyến.</span>
              </div>

              <div className={cx("subtabs-container")}>
                <button 
                  className={cx("subtab-btn", inviteSubTab === "single" && "active")}
                  onClick={() => setInviteSubTab("single")}
                >
                  Tạo cho từng khách
                </button>
                <button 
                  className={cx("subtab-btn", inviteSubTab === "bulk" && "active")}
                  onClick={() => setInviteSubTab("bulk")}
                >
                  Tạo hàng loạt (Danh sách dán)
                </button>
              </div>

              {/* Single Guest Generator */}
              {inviteSubTab === "single" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div className={cx("field")}>
                    <label><FaUsers /> Tên khách mời (Văn bản hiển thị trên thiệp)</label>
                    <input 
                      type="text" 
                      placeholder="Vd: Anh Tuấn & Bạn, Gia đình cô Út..."
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                    />
                  </div>

                  {guestName.trim() && (
                    <div className={cx("qr-result-card")}>
                      <span style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: "600" }}>
                        Thiệp mời dành cho: <strong style={{ color: "#f8fafc" }}>{guestName}</strong>
                      </span>
                      <img 
                        src={getQRCodeUrl(getGuestLink(guestName))} 
                        className={cx("qr-code-img")} 
                        alt="Guest Invitation QR"
                      />
                      <div className={cx("field")} style={{ width: "100%", textAlign: "left" }}>
                        <label>Đường dẫn cá nhân hóa</label>
                        <input 
                          type="text" 
                          readOnly 
                          value={getGuestLink(guestName)} 
                          style={{ cursor: "pointer", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)" }}
                          onClick={() => handleCopyLink(getGuestLink(guestName))}
                        />
                      </div>
                      <div className={cx("qr-actions")}>
                        <button className={cx("copy-btn")} onClick={() => handleCopyLink(getGuestLink(guestName))}>
                          <FaLink /> Copy Link
                        </button>
                        <button className={cx("download-btn")} onClick={() => handleDownloadQR(getQRCodeUrl(getGuestLink(guestName)), guestName)}>
                          <FaDownload /> Tải ảnh QR
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bulk Guests Generator */}
              {inviteSubTab === "bulk" && (
                <div>
                  <div className={cx("field")}>
                    <label>Nhập danh sách tên khách mời (Mỗi khách hàng một dòng)</label>
                    <textarea 
                      rows="6"
                      placeholder="Vd:&#10;Anh Tuấn & Bạn&#10;Gia đình chú Tư&#10;Bạn thân học cấp 3&#10;Chị Hoa đồng nghiệp"
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                    />
                  </div>

                  <button 
                    onClick={handleBulkGenerate} 
                    className={cx("git-sync-run-btn")} 
                    style={{ margin: "16px 0", maxWidth: "240px", background: "#818cf8", color: "#1e1b4b", boxShadow: "0 4px 12px rgba(129,140,248,0.25)" }}
                  >
                    <FaPlus /> Tạo liên kết & QR
                  </button>

                  {bulkGuests.length > 0 && (
                    <div style={{ marginTop: "12px" }}>
                      <div className={cx("bulk-actions-row")}>
                        <span className={cx("stats-info")}>Đã tạo: <strong>{bulkGuests.length}</strong> thư mời.</span>
                        <div className={cx("action-buttons")}>
                          <button 
                            onClick={handleDownloadAllQRs} 
                            className={cx("git-sync-run-btn")} 
                            style={{ margin: "0", background: "#10b981", color: "#022c22", padding: "10px 20px", fontSize: "0.9rem" }}
                          >
                            <FaDownload /> Tải xuống toàn bộ QR (.zip/png)
                          </button>
                        </div>
                      </div>

                      <div className={cx("bulk-table-container")}>
                        <table className={cx("bulk-table")}>
                          <thead>
                            <tr>
                              <th style={{ width: "60px" }}>STT</th>
                              <th>Tên Khách Mời</th>
                              <th>Link Thiệp Mời</th>
                              <th style={{ textAlign: "center" }}>Mã QR</th>
                              <th style={{ width: "120px" }}>Hành động</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bulkGuests.map((guest) => (
                              <tr key={guest.id}>
                                <td>{guest.id}</td>
                                <td className={cx("guest-name-cell")}>{guest.name}</td>
                                <td className={cx("link-cell")} title={guest.link}>{guest.link}</td>
                                <td className={cx("qr-thumbnail-cell")}>
                                  <img 
                                    src={guest.qr} 
                                    alt="QR Preview"
                                    onClick={() => handleDownloadQR(guest.qr, guest.name)} 
                                    title="Nhấn để tải nhanh"
                                  />
                                </td>
                                <td className={cx("actions-cell")}>
                                  <button 
                                    onClick={() => handleCopyLink(guest.link)} 
                                    title="Copy liên kết"
                                  >
                                    <FaCopy />
                                  </button>
                                  <button 
                                    className={cx("download")}
                                    onClick={() => handleDownloadQR(guest.qr, guest.name)} 
                                    title="Tải ảnh QR"
                                  >
                                    <FaDownload />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SEO METADATA CONFIGURATION */}
          {activeTab === "seo" && (
            <div className={cx("panel")}>
              <h2><FaGlobe /> Cấu hình SEO & Tiêu đề Chia sẻ (OpenGraph Meta)</h2>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "20px" }}>Tùy chỉnh tiêu đề hiển thị và hình ảnh thu nhỏ khi bạn chia sẻ link thiệp cưới qua Facebook, Zalo, Messenger...</p>

              {/* Main Page SEO */}
              <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "14px", padding: "24px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#a5b4fc" }}>🔗 Trang chính (Home Page)</h3>
                <div className={cx("field")} style={{ marginBottom: "12px" }}>
                  <label>Tiêu đề Trang chủ (Title)</label>
                  <input 
                    type="text" 
                    value={config.metaData?.main?.title || ""} 
                    onChange={(e) => setNestedVal(["metaData", "main", "title"], e.target.value)}
                  />
                </div>
                <div className={cx("field")}>
                  <label>Ảnh thu nhỏ khi share (Graph Image)</label>
                  <div className={cx("file-upload-block")}>
                    <input 
                      type="text" 
                      value={config.metaData?.main?.graphImage || ""} 
                      onChange={(e) => setNestedVal(["metaData", "main", "graphImage"], e.target.value)}
                    />
                    <label className={cx("upload-label")}>
                      <FaUpload /> Tải ảnh
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["metaData", "main", "graphImage"], url), "image", config.metaData?.main?.graphImage)}
                      />
                    </label>
                  </div>
                  {config.metaData?.main?.graphImage && (
                    <img src={config.metaData.main.graphImage} className={cx("preview-thumbnail")} alt="SEO Main" />
                  )}
                </div>
              </div>

              {/* Wish Page SEO */}
              <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "14px", padding: "24px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#a5b4fc" }}>💬 Trang lời chúc (Wishes List Page)</h3>
                <div className={cx("field")} style={{ marginBottom: "12px" }}>
                  <label>Tiêu đề Trang lời chúc</label>
                  <input 
                    type="text" 
                    value={config.metaData?.wish?.title || ""} 
                    onChange={(e) => setNestedVal(["metaData", "wish", "title"], e.target.value)}
                  />
                </div>
                <div className={cx("field")}>
                  <label>Ảnh thu nhỏ khi share</label>
                  <div className={cx("file-upload-block")}>
                    <input 
                      type="text" 
                      value={config.metaData?.wish?.graphImage || ""} 
                      onChange={(e) => setNestedVal(["metaData", "wish", "graphImage"], e.target.value)}
                    />
                    <label className={cx("upload-label")}>
                      <FaUpload /> Tải ảnh
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["metaData", "wish", "graphImage"], url), "image", config.metaData?.wish?.graphImage)}
                      />
                    </label>
                  </div>
                  {config.metaData?.wish?.graphImage && (
                    <img src={config.metaData.wish.graphImage} className={cx("preview-thumbnail")} alt="SEO Wish" />
                  )}
                </div>
              </div>

              {/* Invitation Form Page SEO */}
              <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "14px", padding: "24px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#a5b4fc" }}>✉️ Trang nhập tên Khách mời (Invitation Form)</h3>
                <div className={cx("field")} style={{ marginBottom: "12px" }}>
                  <label>Tiêu đề Trang nhập tên</label>
                  <input 
                    type="text" 
                    value={config.metaData?.invitation?.title || ""} 
                    onChange={(e) => setNestedVal(["metaData", "invitation", "title"], e.target.value)}
                  />
                </div>
                <div className={cx("field")}>
                  <label>Ảnh thu nhỏ khi share</label>
                  <div className={cx("file-upload-block")}>
                    <input 
                      type="text" 
                      value={config.metaData?.invitation?.graphImage || ""} 
                      onChange={(e) => setNestedVal(["metaData", "invitation", "graphImage"], e.target.value)}
                    />
                    <label className={cx("upload-label")}>
                      <FaUpload /> Tải ảnh
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["metaData", "invitation", "graphImage"], url), "image", config.metaData?.invitation?.graphImage)}
                      />
                    </label>
                  </div>
                  {config.metaData?.invitation?.graphImage && (
                    <img src={config.metaData.invitation.graphImage} className={cx("preview-thumbnail")} alt="SEO Invitation" />
                  )}
                </div>
              </div>

              {/* Albums Page SEO */}
              <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "14px", padding: "24px" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#a5b4fc" }}>🖼️ Trang Album chi tiết (Detail Albums Page)</h3>
                <div className={cx("field")} style={{ marginBottom: "12px" }}>
                  <label>Tiêu đề Trang Album</label>
                  <input 
                    type="text" 
                    value={config.metaData?.album?.title || ""} 
                    onChange={(e) => setNestedVal(["metaData", "album", "title"], e.target.value)}
                  />
                </div>
                <div className={cx("field")}>
                  <label>Ảnh thu nhỏ khi share</label>
                  <div className={cx("file-upload-block")}>
                    <input 
                      type="text" 
                      value={config.metaData?.album?.graphImage || ""} 
                      onChange={(e) => setNestedVal(["metaData", "album", "graphImage"], e.target.value)}
                    />
                    <label className={cx("upload-label")}>
                      <FaUpload /> Tải ảnh
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["metaData", "album", "graphImage"], url), "image", config.metaData?.album?.graphImage)}
                      />
                    </label>
                  </div>
                  {config.metaData?.album?.graphImage && (
                    <img src={config.metaData.album.graphImage} className={cx("preview-thumbnail")} alt="SEO Album" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: GITHUB SYNC */}
          {activeTab === "github" && (
            <div className={cx("panel")}>
              <h2><FaGithub /> Đồng bộ mã nguồn & Đẩy lên GitHub</h2>
              <p className={cx("description")} style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.6" }}>
                Sau khi bạn chỉnh sửa và lưu cấu hình cục bộ hoàn chỉnh, nhấn nút phía dưới để tự động commit thay đổi và đẩy (Push) lên kho lưu trữ GitHub của bạn. Trang web phiên bản Online sẽ được cập nhật tự động ngay lập tức (thông qua Vercel hoặc GitHub Pages).
              </p>

              <button 
                onClick={handleGitSync} 
                className={cx("git-sync-run-btn")} 
                disabled={gitSyncing}
              >
                {gitSyncing ? <FaSpinner className={cx("spinner")} /> : <FaGithub />} {gitSyncing ? "Đang đẩy code lên GitHub..." : "Bắt đầu đẩy code lên GitHub"}
              </button>

              <div className={cx("terminal-box")}>
                <div className={cx("terminal-header")}>
                  <span>CONSOLE GIT LOGS</span>
                  <div className={cx("terminal-actions")}>
                    {gitLogs.length > 0 && (
                      <button className={cx("copy-logs-btn")} onClick={copyLogsToClipboard}>
                        <FaCopy /> Sao chép Logs
                      </button>
                    )}
                    <span className={cx("status-dot", gitSyncing ? "running" : "idle")}></span>
                  </div>
                </div>
                <div className={cx("terminal-body")}>
                  {gitLogs.length === 0 ? (
                    <span className={cx("placeholder")}>Chưa chạy tiến trình đồng bộ nào. Hãy ấn nút xanh ở trên để chạy.</span>
                  ) : (
                    gitLogs.map((log, index) => (
                      <div key={index} className={cx("log-line")}>
                        <span className={cx("log-prompt")}>$</span> {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
