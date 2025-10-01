/**
 * Drag-and-drop interactive resume model
 * Allows dragging skills/projects/achievements into a "story forge" to generate a career story
 */
(function(global) {
    var selectedItems = [];

    function initDragAndDrop() {
        var draggables = document.querySelectorAll('[data-draggable="true"]');
        var dropzone = document.getElementById('story-dropzone');
        var forgeButton = document.getElementById('forge-story');

        draggables.forEach(function(el) {
            el.setAttribute('draggable', 'true');
            el.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', el.getAttribute('data-item'));
                el.classList.add('ring-2', 'ring-indigo-400');
            });
            el.addEventListener('dragend', function() {
                el.classList.remove('ring-2', 'ring-indigo-400');
            });
        });

        if (dropzone) {
            dropzone.addEventListener('dragover', function(e) {
                e.preventDefault();
                dropzone.classList.add('ring-2', 'ring-indigo-400');
            });
            dropzone.addEventListener('dragleave', function() {
                dropzone.classList.remove('ring-2', 'ring-indigo-400');
            });
            dropzone.addEventListener('drop', function(e) {
                e.preventDefault();
                dropzone.classList.remove('ring-2', 'ring-indigo-400');
                var item = e.dataTransfer.getData('text/plain');
                if (item) {
                    selectedItems.push(item);
                    renderSelectedItems();
                }
            });
        }

        if (forgeButton) {
            forgeButton.addEventListener('click', generateStory);
        }
    }

    function renderSelectedItems() {
        var list = document.getElementById('selected-items');
        if (!list) return;
        list.innerHTML = '';
        selectedItems.slice(-10).forEach(function(txt) {
            var li = document.createElement('span');
            li.className = 'glow-pill px-2 py-1 rounded mr-2 mb-2 inline-block text-sm';
            li.textContent = txt;
            list.appendChild(li);
        });
    }

    async function generateStory() {
        var output = document.getElementById('story-output');
        if (!output || selectedItems.length === 0) return;
        output.textContent = 'Generating story...';

        var prompt = 'Create a concise, professional career story based on these elements: ' + selectedItems.join(', ') + '. Focus on impact, technologies, and outcomes.';

        try {
            var context = (window.RAGModule && window.RAGModule.retrieveRelevantContext) ? window.RAGModule.retrieveRelevantContext(selectedItems.join(' ')) : '';
            var resp;
            if (window.API) {
                resp = await window.API.callGeminiProxy(prompt, context);
            } else if (window.RAGModule && window.RAGModule.generateRAGResponse) {
                resp = await window.RAGModule.generateRAGResponse(prompt);
            } else {
                resp = 'Story: ' + prompt;
            }
            output.textContent = resp;
        } catch (e) {
            output.textContent = 'Could not generate story. Please try again later.';
        }
    }

    global.DragModel = {
        init: initDragAndDrop
    };
})(window);




