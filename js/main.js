// DOM Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const compressBtn = document.getElementById('compress-btn');
const output = document.getElementById('output');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('quality-value');
const resizeSlider = document.getElementById('resize');
const resizeValue = document.getElementById('resize-value');
const originalSize = document.getElementById('original-size');
const estimatedSize = document.getElementById('estimated-size');
const originalPreview = document.getElementById('original-preview');
const previewContainer = document.getElementById('preview');

let imageFile;

// Format file size for display
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// Handle file drop or selection
function handleFileLoad() {
  if (!imageFile) return;

  originalSize.textContent = formatSize(imageFile.size);
  updateEstimate();

  const reader = new FileReader();
  reader.onload = (e) => {
    originalPreview.src = e.target.result;
    previewContainer.classList.add('visible');
  };
  reader.readAsDataURL(imageFile);
}

// Update estimated size based on quality
function updateEstimate() {
  if (imageFile) {
    const estimated = imageFile.size * (qualitySlider.value / 100);
    estimatedSize.textContent = formatSize(estimated);
  }
}

// Generate a unique file name for the compressed image
function generateFileName() {
  return `compressed_${Date.now()}_${Math.floor(Math.random() * 100000)}.jpg`;
}

// Compress and download the image
function compressImage() {
  if (!imageFile) return alert('Please upload an image first.');

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Resize the image
      const scale = resizeSlider.value / 100;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Compress the image
      const quality = qualitySlider.value / 100;
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const fileName = generateFileName();
        output.innerHTML = `<a href="${url}" download="${fileName}">Download Compressed Image</a>`;
      }, 'image/jpeg', quality);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(imageFile);
}

// Event Listeners
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  imageFile = e.dataTransfer.files[0];
  handleFileLoad();
});
fileInput.addEventListener('change', (e) => {
  imageFile = e.target.files[0];
  handleFileLoad();
});
qualitySlider.addEventListener('input', () => {
  qualityValue.textContent = `${qualitySlider.value}%`;
  updateEstimate();
});
resizeSlider.addEventListener('input', () => {
  resizeValue.textContent = `${resizeSlider.value}%`;
});
compressBtn.addEventListener('click', compressImage);