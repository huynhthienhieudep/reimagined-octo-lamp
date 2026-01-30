document.addEventListener('DOMContentLoaded', function() {
    const SLIDER_MEDIA = document.querySelectorAll(".slider-media");
    const MEDIA_NAME = document.getElementById('media-name'); 
    let CURRENT_INDEX = 0;
    let DEFAULT_PHOTO_TIME = 8000; // Ảnh dừng 8 giây
    let MAX_VIDEO_TIME = 20000;    // Video tối đa 10 giây
    let INTERVAL_ID;

    function UPDATE_MEDIA_NAME() {
        const GET_NEXT_NAME = SLIDER_MEDIA[CURRENT_INDEX].getAttribute('data-name');
        if (MEDIA_NAME) {
            MEDIA_NAME.style.opacity = 0;
            setTimeout(() => {
                MEDIA_NAME.textContent = GET_NEXT_NAME || "CLB Chuyên Bạc Liêu";
                MEDIA_NAME.style.opacity = 1;
            }, 500);
        }
    };

    function SHOW_NEXT_SLIDE() {
        // Dừng video cũ
        const CURRENT_ACTIVE = SLIDER_MEDIA[CURRENT_INDEX];
        if (CURRENT_ACTIVE.tagName === 'VIDEO') {
            CURRENT_ACTIVE.pause();
        }
        CURRENT_ACTIVE.classList.remove('active');

        //Chuyển sang Index tiếp theo
        CURRENT_INDEX = (CURRENT_INDEX + 1) % SLIDER_MEDIA.length;
        
        //Kích hoạt sslide mới
        const NEXT_MEDIA = SLIDER_MEDIA[CURRENT_INDEX];
        NEXT_MEDIA.classList.add('active');

        // Cập nhật tên hiển thị
        UPDATE_MEDIA_NAME();

        //  Tính toán thời gian dừng cho slide này
        let NEXT_TIME = DEFAULT_PHOTO_TIME;

        if (NEXT_MEDIA.tagName === 'VIDEO') {
            NEXT_MEDIA.currentTime = 0; // Luôn chạy lại từ đầu video
            NEXT_MEDIA.play().catch(e => console.log("Autoplay bị chặn"));
            
            // LOGIC GIỚI HẠN 10 GIÂY
            // Nếu video dài hơn 10s, chỉ lấy 10s. Nếu ngắn hơn 10s, lấy theo thời gian thực của nó.
            if (!isNaN(NEXT_MEDIA.duration) && NEXT_MEDIA.duration > 0) {
                let VIDEO_DURATION_MS = NEXT_MEDIA.duration * 1000;
                NEXT_TIME = Math.min(VIDEO_DURATION_MS + 500, MAX_VIDEO_TIME); 
            } else {
                NEXT_TIME = MAX_VIDEO_TIME; 
            }
        }

        // Reset vòng lặp với thời gian đã tính
        clearInterval(INTERVAL_ID);
        INTERVAL_ID = setInterval(SHOW_NEXT_SLIDE, NEXT_TIME);
    };

    // KHỞI CHẠY LẦN ĐẦU
    UPDATE_MEDIA_NAME();
    
    // Kiểm tra slide đầu tiên nếu là video thì áp dụng luật đã kêu ở trên ngay
    let INITIAL_TIME = DEFAULT_PHOTO_TIME;
    if (SLIDER_MEDIA[CURRENT_INDEX].tagName === 'VIDEO') {
        SLIDER_MEDIA[CURRENT_INDEX].play().catch(e => console.log("Lỗi ngớ ngẩn"));
        INITIAL_TIME = MAX_VIDEO_TIME; 
    }

    INTERVAL_ID = setInterval(SHOW_NEXT_SLIDE, INITIAL_TIME);
});