/* ==========================================================================
   SynapseIQ Landing Controller
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Dynamic Greeting based on Client Local Time
  const greetingTitle = document.getElementById("greeting-title");
  if (greetingTitle) {
    const hour = new Date().getHours();
    let greetingText = "Good Evening."; // Default fallback
    
    if (hour < 12) {
      greetingText = "Good Morning.";
    } else if (hour < 17) {
      greetingText = "Good Afternoon.";
    } else {
      greetingText = "Good Evening.";
    }
    
    greetingTitle.textContent = greetingText;
  }

  // 2. Drag & Drop Upload Handlers
  const dropZone = document.getElementById("drop-zone");
  const fileSelector = document.getElementById("file-selector");
  const uploadMainView = document.getElementById("upload-main-view");
  const uploadProgressView = document.getElementById("upload-progress-view");
  const progressFileName = document.getElementById("progress-file-name");
  const progressPercentage = document.getElementById("progress-percentage");
  const progressBarFill = document.getElementById("progress-bar-fill");
  const progressStatusText = document.getElementById("progress-status-text");
  const statusLabel = document.getElementById("upload-status-lbl");

  if (dropZone && fileSelector) {
    // Click zone triggers file input
    dropZone.addEventListener("click", (e) => {
      // Prevent double trigger if clicking internal items
      if (e.target !== fileSelector) {
        fileSelector.click();
      }
    });

    // File input changes
    fileSelector.addEventListener("change", (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    });

    // Drag-over styling shifts
    ["dragenter", "dragover"].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add("drag-active");
      }, false);
    });

    ["dragleave", "drop"].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove("drag-active");
      }, false);
    });

    // File drop capture
    dropZone.addEventListener("drop", (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    }, false);
  }

  // 3. File Processor & Redirect Simulator
  function processFile(file) {
    const fileName = file.name;
    const extension = fileName.split(".").pop().toLowerCase();
    
    // Accept only CSV or Excel formats
    if (extension !== "csv" && extension !== "xlsx" && extension !== "xls") {
      statusLabel.textContent = "Invalid Format";
      statusLabel.style.color = "var(--color-accent-terracotta)";
      
      const titleEl = document.querySelector(".upload-title");
      const subtitleEl = document.querySelector(".upload-subtitle");
      
      if (titleEl) titleEl.textContent = "Supported Formats Only";
      if (subtitleEl) {
        subtitleEl.textContent = "Please select a valid CSV or Excel file.";
        subtitleEl.style.color = "var(--color-accent-terracotta)";
      }
      
      // Reset after 3 seconds
      setTimeout(() => {
        statusLabel.textContent = "Ready for Synthesis";
        statusLabel.style.color = "";
        if (titleEl) titleEl.textContent = "Upload your business dataset.";
        if (subtitleEl) {
          subtitleEl.textContent = "Drag and drop file here, or click to browse";
          subtitleEl.style.color = "";
        }
      }, 3000);
      
      return;
    }

    // Execute upload layout transition
    uploadMainView.classList.add("hidden");
    uploadProgressView.classList.remove("hidden");
    
    progressFileName.textContent = fileName;
    statusLabel.textContent = "Synthesis In Progress";
    statusLabel.style.color = "var(--color-accent-sage)";

    simulateSynthesis();
  }

  // 4. Progress bar increments mimicking pipeline modeling
  function simulateSynthesis() {
    let progress = 0;
    const intervalTime = 25; // 25ms * 100 ticks = 2.5 seconds total
    
    const stageNotes = [
      { max: 25, text: "Parsing columns and mapping metrics..." },
      { max: 55, text: "Calibrating Southeast Asia port latency vectors..." },
      { max: 80, text: "Modeling supply chain cost forecast curves..." },
      { max: 100, text: "Compiling executive briefing summaries..." }
    ];

    const timer = setInterval(() => {
      progress += 1;
      
      // Update UI elements
      progressPercentage.textContent = `${progress}%`;
      progressBarFill.style.width = `${progress}%`;
      
      // Select appropriate synthesis descriptor
      const currentStage = stageNotes.find(stage => progress <= stage.max);
      if (currentStage) {
        progressStatusText.textContent = currentStage.text;
      }

      if (progress >= 100) {
        clearInterval(timer);
        progressStatusText.textContent = "Synthesis complete. Opening desk sheet...";
        
        // Faint sheet swap delay before redirection
        setTimeout(() => {
          window.location.href = "workspace.html";
        }, 300);
      }
    }, intervalTime);
  }

  // "Get Started" Navigation Button Link
  const navStartBtn = document.getElementById("btn-nav-start");
  if (navStartBtn) {
    navStartBtn.addEventListener("click", () => {
      // Direct navigate to workspace if they click "Get Started" without dropping files
      window.location.href = "workspace.html";
    });
  }
});
