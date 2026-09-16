#!/bin/bash
# 1. Add pdf.js
sed -i '/<style>/i \    <!-- PDF.js pour la lecture de PDF -->\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"></script>\n    <script>pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";</script>\n' index.html

# 2. Modify accept attribute
sed -i 's/accept="image\/\*"/accept="image\/*,application\/pdf"/' index.html

# 3. Add modal HTML
sed -i '/<div id="drop-zone">/i \
            <!-- Modal PDF Selection -->\
            <div id="pdf-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">\
                <div style="background: white; padding: 20px; border-radius: 8px; width: 80%; max-height: 80vh; display: flex; flex-direction: column;">\
                    <h3 style="margin-top: 0;">Sélectionnez les pages à importer</h3>\
                    <div id="pdf-pages-container" style="display: flex; flex-wrap: wrap; gap: 10px; overflow-y: auto; flex: 1; margin-bottom: 20px;">\
                    </div>\
                    <div style="display: flex; justify-content: flex-end; gap: 10px;">\
                        <button type="button" class="secondary" onclick="closePdfModal()">Annuler</button>\
                        <button type="button" class="primary" onclick="confirmPdfSelection()">Valider la sélection</button>\
                    </div>\
                </div>\
            </div>\
' index.html

# 4. Add modal CSS
sed -i '/<\/style>/i \
        .pdf-page-thumb {\
            border: 2px solid transparent;\
            cursor: pointer;\
            border-radius: 4px;\
            overflow: hidden;\
            position: relative;\
        }\
        .pdf-page-thumb.selected {\
            border-color: var(--success);\
        }\
        .pdf-page-thumb img {\
            display: block;\
            max-width: 150px;\
            height: auto;\
        }\
        .pdf-page-thumb .page-number {\
            position: absolute;\
            bottom: 4px;\
            right: 4px;\
            background: rgba(0,0,0,0.7);\
            color: white;\
            padding: 2px 6px;\
            border-radius: 10px;\
            font-size: 0.8rem;\
        }\
' index.html

# 5. Add pendingPdfPages variable
sed -i '/let isAutoCropRunning = false;/i \        let pendingPdfPages = [];\
' index.html

# 6. Replace loadFile and add loadPdfFile and modal actions
cat << 'INNER_EOF' > loadfile.tmp
        async function loadFile(file) {
            if (file.type === 'application/pdf') {
                await loadPdfFile(file);
                return;
            }
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                rawImage.onload = () => {
                    dropZone.style.display = 'none';
                    workspace.style.display = 'flex';
                    setupSourceCanvas();
                    analyzeSourceImage();
                    resetPoints(false);
                    hideResultAlert();
                    autoDetectFrame();
                };
                rawImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        async function loadPdfFile(file) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
            const numPages = pdf.numPages;
            const container = document.getElementById('pdf-pages-container');
            container.innerHTML = '';

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({scale: 1.5}); // Adjust scale as needed for thumbnails
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({canvasContext: ctx, viewport: viewport}).promise;

                const thumbDiv = document.createElement('div');
                thumbDiv.className = 'pdf-page-thumb selected';
                thumbDiv.dataset.pageIndex = i - 1;
                thumbDiv.innerHTML = `
                    <img src="${canvas.toDataURL('image/jpeg', 0.8)}">
                    <div class="page-number">${i}</div>
                `;
                thumbDiv.onclick = function() {
                    this.classList.toggle('selected');
                };
                container.appendChild(thumbDiv);
            }
            document.getElementById('pdf-modal').style.display = 'flex';
        }

        function closePdfModal() {
            document.getElementById('pdf-modal').style.display = 'none';
            fileInput.value = '';
        }

        function confirmPdfSelection() {
            const container = document.getElementById('pdf-pages-container');
            const selectedThumbs = container.querySelectorAll('.pdf-page-thumb.selected');

            pendingPdfPages = [];
            selectedThumbs.forEach(thumb => {
                const img = thumb.querySelector('img');
                pendingPdfPages.push(img.src);
            });

            closePdfModal();

            if (pendingPdfPages.length > 0) {
                loadNextPendingPdfPage();
            }
        }

        function loadNextPendingPdfPage() {
            if (pendingPdfPages.length === 0) {
                clearCurrentWorkspace();
                return;
            }
            const dataUrl = pendingPdfPages.shift(); // take the first one out

            rawImage.onload = () => {
                dropZone.style.display = 'none';
                workspace.style.display = 'flex';
                setupSourceCanvas();
                analyzeSourceImage();
                resetPoints(false);
                hideResultAlert();
                autoDetectFrame();
            };
            rawImage.src = dataUrl;
        }

INNER_EOF

# The original loadFile goes from line 671 to 687. Let's find exactly the lines to replace.
sed -i -e '/function loadFile(file) {/,/        }/c \
'"$(cat loadfile.tmp | sed -z 's/\n/\\n/g')"'' index.html
rm loadfile.tmp

# 7. Update addCurrentPageAndReset
cat << 'INNER_EOF' > workspace.tmp
        function addCurrentPageAndReset() {
            if (!resultCanvas.width) {
                alert("Veuillez d'abord générer un aperçu de document.");
                return;
            }

            const imgDataUrl = resultCanvas.toDataURL('image/jpeg', 0.92);
            pdfPageQueue.push({
                dataUrl: imgDataUrl,
                width: resultCanvas.width,
                height: resultCanvas.height
            });

            renderQueueThumbnails();

            if (pendingPdfPages && pendingPdfPages.length > 0) {
                loadNextPendingPdfPage();
            } else {
                clearCurrentWorkspace();
            }
        }

        function clearCurrentWorkspace() {
INNER_EOF

# Find addCurrentPageAndReset and clearCurrentWorkspace in one sed
sed -i -e '/function addCurrentPageAndReset() {/,/function clearCurrentWorkspace() {/c \
'"$(cat workspace.tmp | sed -z 's/\n/\\n/g')"'' index.html
rm workspace.tmp
