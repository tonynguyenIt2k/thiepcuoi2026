"use client";
import React, { useState, useEffect, useRef } from "react";
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
  FaArrowLeft
} from "react-icons/fa";

const cx = classNames.bind(styles);

export default function Editor() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gitSyncing, setGitSyncing] = useState(false);
  const [gitLogs, setGitLogs] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [config, setConfig] = useState(null);

  // Giữ danh sách ảnh tạm thời để add/remove dễ dàng
  const [albumImages, setAlbumImages] = useState([]);
  const [finalImages, setFinalImages] = useState([]);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/config");
      const data = await res.json();
      if (res.ok) {
        setConfig(data);
        setAlbumImages(data.albumSection?.images || []);
        setFinalImages(data.finalSection?.images || []);
      } else {
        showError("Không thể tải cấu hình: " + (data.error || "Lỗi không xác định"));
      }
    } catch (err) {
      showError("Không thể kết nối API: " + err.message);
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
      // Cập nhật các danh sách ảnh vào config gốc trước khi gửi
      const updatedConfig = {
        ...config,
        albumSection: { ...config.albumSection, images: albumImages },
        finalSection: { ...config.finalSection, images: finalImages }
      };

      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedConfig)
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess(data.message || "Đã lưu cấu hình thành công!");
        // Cập nhật lại config nội bộ từ API
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

  const handleFileUpload = async (event, callback, type = "image") => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate type
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
      
      // Auto save cấu hình hiện tại trước khi đẩy lên github
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

  // Trợ lý đổi giá trị cấu hình nông (shallow changes)
  const setNestedVal = (path, value) => {
    setConfig(prev => {
      const copy = { ...prev };
      let current = copy;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return copy;
    });
  };

  if (loading) {
    return (
      <div className={cx("loading-screen")}>
        <FaSpinner className={cx("spinner")} />
        <p>Đang tải cấu hình thiệp cưới...</p>
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
          {message.text}
        </div>
      )}

      <div className={cx("editor-layout")}>
        {/* Sidebar tabs */}
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
            <FaSave /> Tài khoản Bank & QR
          </button>
          <button 
            className={cx("tab-btn", activeTab === "gallery" && "active")}
            onClick={() => setActiveTab("gallery")}
          >
            <FaImage /> Hình ảnh & Nhạc nền
          </button>
          <button 
            className={cx("tab-btn", activeTab === "github" && "active")}
            onClick={() => setActiveTab("github")}
          >
            <FaGithub /> Đồng bộ GitHub logs
          </button>
        </aside>

        {/* Content Form */}
        <main className={cx("form-content")}>
          {activeTab === "general" && (
            <div className={cx("panel")}>
              <h2>Thông tin chung Thiệp cưới</h2>
              
              <div className={cx("nested-grid")}>
                <div className={cx("field")}>
                  <label>Ngày làm lễ (Vd: 22/12)</label>
                  <input 
                    type="text" 
                    value={config.weddingInfo[0]?.time?.date || ""} 
                    onChange={(e) => setNestedVal(["weddingInfo", 0, "time", "date"], e.target.value)}
                  />
                </div>
                <div className={cx("field")}>
                  <label>Năm (Vd: 2024 hoặc 2026)</label>
                  <input 
                    type="text" 
                    value={config.weddingInfo[0]?.time?.year || ""} 
                    onChange={(e) => setNestedVal(["weddingInfo", 0, "time", "year"], e.target.value)}
                  />
                </div>
                <div className={cx("field")}>
                  <label>Giờ chính thức (Vd: 11:00)</label>
                  <input 
                    type="text" 
                    value={config.weddingInfo[0]?.time?.time || ""} 
                    onChange={(e) => setNestedVal(["weddingInfo", 0, "time", "time"], e.target.value)}
                  />
                </div>
                <div className={cx("field")}>
                  <label>Chữ cái Cô dâu (Vd: T)</label>
                  <input 
                    type="text" 
                    maxLength="1"
                    value={config.introSection?.brideFirstLetter || ""} 
                    onChange={(e) => setNestedVal(["introSection", "brideFirstLetter"], e.target.value)}
                  />
                </div>
                <div className={cx("field")}>
                  <label>Chữ cái Chú rể (Vd: H)</label>
                  <input 
                    type="text" 
                    maxLength="1"
                    value={config.introSection?.groomFirstLetter || ""} 
                    onChange={(e) => setNestedVal(["introSection", "groomFirstLetter"], e.target.value)}
                  />
                </div>
              </div>

              <div className={cx("field")}>
                <label>Văn bản ngày giờ đầy đủ</label>
                <input 
                  type="text" 
                  value={config.weddingInfo[0]?.time?.full || ""} 
                  onChange={(e) => setNestedVal(["weddingInfo", 0, "time", "full"], e.target.value)}
                />
              </div>

              <div className={cx("field")}>
                <label>Địa chỉ tổ chức hôn lễ</label>
                <input 
                  type="text" 
                  value={config.weddingInfo[0]?.address || ""} 
                  onChange={(e) => setNestedVal(["weddingInfo", 0, "address"], e.target.value)}
                />
              </div>

              <div className={cx("field")}>
                <label>Tuyến đường/Chi tiết địa chỉ</label>
                <input 
                  type="text" 
                  value={config.weddingInfo[0]?.street || ""} 
                  onChange={(e) => setNestedVal(["weddingInfo", 0, "street"], e.target.value)}
                />
              </div>

              <div className={cx("field")}>
                <label>Số điện thoại liên hệ chính</label>
                <input 
                  type="text" 
                  value={config.weddingInfo[0]?.phone || ""} 
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
                    <FaUpload /> Tải ảnh
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["introSection", "mainImage"], url))}
                    />
                  </label>
                </div>
                {config.introSection?.mainImage && (
                  <img src={config.introSection.mainImage} className={cx("preview-thumbnail")} alt="Bìa" />
                )}
              </div>
            </div>
          )}

          {activeTab === "profiles" && (
            <div className={cx("panel")}>
              <h2>Hồ sơ Cặp đôi</h2>
              
              <div className={cx("field")}>
                <label>Lời ngỏ / Mô tả ngắn</label>
                <textarea 
                  rows="3"
                  value={config.profileSection?.description || ""} 
                  onChange={(e) => setNestedVal(["profileSection", "description"], e.target.value)}
                />
              </div>

              <hr className={cx("divider")} />

              {/* Cô dâu */}
              <h3>Hồ sơ Cô Dâu (Bride)</h3>
              <div className={cx("nested-grid")}>
                <div className={cx("field")}>
                  <label>Tên Cô dâu</label>
                  <input 
                    type="text" 
                    value={config.profileSection?.profiles[0]?.name || ""} 
                    onChange={(e) => setNestedVal(["profileSection", "profiles", 0, "name"], e.target.value)}
                  />
                </div>
                <div className={cx("field")}>
                  <label>Ảnh đại diện Cô dâu (Avatar)</label>
                  <div className={cx("file-upload-block")}>
                    <input 
                      type="text" 
                      value={config.profileSection?.profiles[0]?.avatar || ""} 
                      onChange={(e) => setNestedVal(["profileSection", "profiles", 0, "avatar"], e.target.value)}
                    />
                    <label className={cx("upload-label")}>
                      <FaUpload /> Tải ảnh
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["profileSection", "profiles", 0, "avatar"], url))}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Chú rể */}
              <h3>Hồ sơ Chú Rể (Groom)</h3>
              <div className={cx("nested-grid")}>
                <div className={cx("field")}>
                  <label>Tên Chú rể</label>
                  <input 
                    type="text" 
                    value={config.profileSection?.profiles[1]?.name || ""} 
                    onChange={(e) => setNestedVal(["profileSection", "profiles", 1, "name"], e.target.value)}
                  />
                </div>
                <div className={cx("field")}>
                  <label>Ảnh đại diện Chú rể (Avatar)</label>
                  <div className={cx("file-upload-block")}>
                    <input 
                      type="text" 
                      value={config.profileSection?.profiles[1]?.avatar || ""} 
                      onChange={(e) => setNestedVal(["profileSection", "profiles", 1, "avatar"], e.target.value)}
                    />
                    <label className={cx("upload-label")}>
                      <FaUpload /> Tải ảnh
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["profileSection", "profiles", 1, "avatar"], url))}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "banking" && (
            <div className={cx("panel")}>
              <h2>Tài khoản ngân hàng & QR mừng cưới</h2>
              
              <div className={cx("field")}>
                <label>Ảnh tiêu đề Gift Section</label>
                <div className={cx("file-upload-block")}>
                  <input 
                    type="text" 
                    value={config.giftSection?.image || ""}
                    onChange={(e) => setNestedVal(["giftSection", "image"], e.target.value)}
                  />
                  <label className={cx("upload-label")}>
                    <FaUpload /> Tải ảnh
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["giftSection", "image"], url))}
                    />
                  </label>
                </div>
              </div>

              <div className={cx("bank-grid")}>
                {/* Bank Cô dâu */}
                <div className={cx("bank-card")}>
                  <h3>Tài khoản Cô Dâu</h3>
                  <div className={cx("field")}>
                    <label>Chủ tài khoản</label>
                    <input 
                      type="text" 
                      value={config.giftSection?.brideBank?.name || ""} 
                      onChange={(e) => setNestedVal(["giftSection", "brideBank", "name"], e.target.value)}
                    />
                  </div>
                  <div className={cx("field")}>
                    <label>Tên ngân hàng</label>
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
                    <label>Mã QR Code mừng cưới</label>
                    <div className={cx("file-upload-block")}>
                      <input 
                        type="text" 
                        placeholder="Có thể để trống để dùng QR mặc định"
                        value={config.giftSection?.brideBank?.qr || ""} 
                        onChange={(e) => setNestedVal(["giftSection", "brideBank", "qr"], e.target.value)}
                      />
                      <label className={cx("upload-label")}>
                        <FaUpload /> Tải
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["giftSection", "brideBank", "qr"], url))}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Bank Chú rể */}
                <div className={cx("bank-card")}>
                  <h3>Tài khoản Chú Rể</h3>
                  <div className={cx("field")}>
                    <label>Chủ tài khoản</label>
                    <input 
                      type="text" 
                      value={config.giftSection?.groomBank?.name || ""} 
                      onChange={(e) => setNestedVal(["giftSection", "groomBank", "name"], e.target.value)}
                    />
                  </div>
                  <div className={cx("field")}>
                    <label>Tên ngân hàng</label>
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
                    <label>Mã QR Code mừng cưới</label>
                    <div className={cx("file-upload-block")}>
                      <input 
                        type="text" 
                        placeholder="Có thể để trống để dùng QR mặc định"
                        value={config.giftSection?.groomBank?.qr || ""} 
                        onChange={(e) => setNestedVal(["giftSection", "groomBank", "qr"], e.target.value)}
                      />
                      <label className={cx("upload-label")}>
                        <FaUpload /> Tải
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["giftSection", "groomBank", "qr"], url))}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div className={cx("panel")}>
              <h2>Hình ảnh Album & Bài hát nhạc nền</h2>

              {/* Nhạc nền */}
              <div className={cx("music-uploader-card")}>
                <h3><FaMusic /> Cấu hình Nhạc Nền</h3>
                <p className={cx("description")}>Tải lên file nhạc hạnh phúc của bạn (.mp3). Nếu để trống, hệ thống tự động phát bài hát mặc định.</p>
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
                      onChange={(e) => handleFileUpload(e, (url) => setNestedVal(["musicUrl"], url), "audio")}
                    />
                  </label>
                </div>
                {config.musicUrl && (
                  <div className={cx("audio-player-preview")}>
                    <audio src={config.musicUrl} controls className={cx("player")} />
                    <button 
                      className={cx("remove-music-btn")}
                      onClick={() => setNestedVal(["musicUrl"], "")}
                    >
                      Xóa nhạc tùy chỉnh (dùng mặc định)
                    </button>
                  </div>
                )}
              </div>

              <hr className={cx("divider")} />

              {/* Bộ đếm ngược thời gian */}
              <h3>Bộ Đếm Ngược Ngày Cưới</h3>
              <div className={cx("nested-grid")}>
                <div className={cx("field")}>
                  <label>Năm đếm ngược</label>
                  <input 
                    type="number" 
                    value={config.timerSection?.weddingTime?.year || 2024} 
                    onChange={(e) => setNestedVal(["timerSection", "weddingTime", "year"], parseInt(e.target.value) || 2024)}
                  />
                </div>
                <div className={cx("field")}>
                  <label>Tháng đếm ngược</label>
                  <input 
                    type="number" 
                    value={config.timerSection?.weddingTime?.month || 12} 
                    onChange={(e) => setNestedVal(["timerSection", "weddingTime", "month"], parseInt(e.target.value) || 12)}
                  />
                </div>
                <div className={cx("field")}>
                  <label>Ngày đếm ngược</label>
                  <input 
                    type="number" 
                    value={config.timerSection?.weddingTime?.day || 22} 
                    onChange={(e) => setNestedVal(["timerSection", "weddingTime", "day"], parseInt(e.target.value) || 22)}
                  />
                </div>
              </div>

              <hr className={cx("divider")} />

              {/* Quản lý ảnh Album chính */}
              <h3>Bộ sưu tập Ảnh Cưới (Core Gallery Images)</h3>
              <div className={cx("gallery-row")}>
                {albumImages.map((img, idx) => (
                  <div key={idx} className={cx("gallery-item")}>
                    <img src={img} alt={`Album ${idx}`} />
                    <button 
                      className={cx("delete-icon-btn")}
                      onClick={() => {
                        setAlbumImages(prev => prev.filter((_, i) => i !== idx));
                      }}
                      title="Xóa ảnh"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                
                {/* Upload box */}
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

          {activeTab === "github" && (
            <div className={cx("panel")}>
              <h2>Đồng bộ với Kho lưu trữ GitHub</h2>
              <p className={cx("description")}>
                Sau khi kiểm tra trang thiệp ở localhost và hài lòng, bạn ấn nút 
                <strong> &quot;Đẩy lên GitHub&quot;</strong> để sao lưu và cập nhật trang web thiệp cưới online (Vercel/GitHub Pages...).
              </p>

              <button 
                onClick={handleGitSync} 
                className={cx("git-sync-run-btn")} 
                disabled={gitSyncing}
              >
                {gitSyncing ? <FaSpinner className={cx("spinner")} /> : <FaGithub />} {gitSyncing ? "Đang đồng bộ..." : "Bắt đầu đẩy code lên GitHub"}
              </button>

              <div className={cx("terminal-box")}>
                <div className={cx("terminal-header")}>
                  <span>Console Git Logs</span>
                  <span className={cx("status-dot", gitSyncing ? "running" : "idle")}></span>
                </div>
                <div className={cx("terminal-body")}>
                  {gitLogs.length === 0 ? (
                    <span className={cx("placeholder")}>Chưa có tiến trình nào chạy. Nhấn nút phía trên để kích hoạt.</span>
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
