(() => {

    /**
     * Toggle Class
     * @param object DOM
     * @param string className
     */
    function toggleClass(DOM, className) {
        DOM.classList.contains(className) ? DOM.classList.remove(className) : DOM.classList.add(className);
    }

    /**
     * Random string
     * @param int length
     */
    function randomString(length = 5) {
        return Array.from({ length }, () => Math.random().toString(36)[2]).join('');
    }


    // ================================
    // Repeater
    // ================================
    /**
    * Ozz Form Repeater initialization
    * @param DOM Used Block
    * @param bindEvent Event for bind with newly added item
    */
    function initRepeater(DOM = false, bindEvent = false) {
        repeater__Accordion(DOM);
        repeater__addItem(DOM, bindEvent);
        repeater__deleteItem(DOM);
    }

    /**
     * Repeater field Accordion
     */
    function repeater__Accordion(repeater = false) {
        const accordionHeads = repeater ? repeater.querySelectorAll('.ozz-fm__repeat-head') : document.querySelectorAll('.ozz-fm__repeat-head');
        accordionHeads.forEach(thisHead => {
            const
                thisHeadParent = thisHead.closest('.ozz-fm__repeat-fields'),
                accordionBody = thisHeadParent.querySelector('.ozz-fm__repeat-body');

            if (thisHead) {
                thisHead.addEventListener('click', (e) => {
                    if (e.target.classList.contains('ozz-fm__repeat-remove')) {
                        return;
                    }

                    toggleClass(accordionBody, 'close');
                    toggleClass(thisHead, 'close');
                })
            }

            // Update repeater title when field input
            const thisRepeater = thisHead.closest('.ozz-fm__repeat-fields');
            const firstField = thisRepeater.querySelector('input[type="text"], input[type="email"], textarea, select');
            if (firstField && thisHead.querySelector('.ozz-fm__repeat-title')) {
                firstField.addEventListener('input', (e) => {
                    thisHead.querySelector('.ozz-fm__repeat-title').textContent = e.target.value;
                });
            }
        });
    }

    /**
     * Add Repeater Item
     */
    function repeater__addItem(DOM, bindEvents = false) {
        const addItemTrigger = DOM ? DOM.querySelectorAll('.ozz-fm__repeat-add') : document.querySelectorAll('.ozz-fm__repeat-add');
        addItemTrigger.forEach(addTrigger => {
            addTrigger.addEventListener('click', (e) => {
                const
                    thisRepeater = e.target.closest('.ozz-fm__repeat'),
                    thisWrapper = thisRepeater.querySelector(':scope > .ozz-fm__repeat-wrapper'),
                    thisItemCount = thisWrapper.querySelectorAll(':scope > .ozz-fm__repeat-fields'),
                    thisItem = thisWrapper.querySelector(':scope > .ozz-fm__repeat-fields'),
                    newItem = thisItem.cloneNode(true),
                    maxRepeates = thisRepeater.getAttribute( 'data-ozz-repeat-max' ) ?? false;

                if (maxRepeates && thisItemCount.length >= maxRepeates) {
                    addTrigger.setAttribute('disabled', true);
                    return false;
                }
                addTrigger.removeAttribute('disabled', true);

                // Add ID to new item
                newItem.setAttribute('id', `rptf-${randomString(18)}`);

                // Clear values and modify repeater item
                const itemFields = newItem.querySelectorAll('input, textarea, button, progress, meter, select, datalist, [data-ozz-wyg]');
                itemFields.forEach(elm => {
                    if (elm.tagName === 'INPUT' || elm.tagName === 'TEXTAREA') {
                        elm.value = '';
                    } else if (elm.tagName === 'SELECT') {
                        elm.selectedIndex = 0;
                    }

                    if (thisRepeater.classList.contains('single') === false) {
                        itemFields.forEach(elm => {
                            if (elm.name) {
                                const newName = elm.name.replace(/__\d+__(?=[^__]*$)/, `__${thisItemCount.length}__`);
                                elm.name = newName;
                            } else if (elm.dataset.fieldName) {
                                const newDataAttr = elm.dataset.fieldName.replace(/__\d+__(?=[^__]*$)/, `__${thisItemCount.length}__`);
                                elm.setAttribute('data-field-name', newDataAttr);
                            }
                        });
                    }

                    // Cleanup inited attributes
                    elm.removeAttribute('data-ozz-condition-inited');

                    // Enable delete button if disabled
                    [thisItem, newItem].forEach(element => {
                        element.querySelector('.ozz-fm__repeat-remove')?.removeAttribute('disabled');
                    });
                });

                // Clear selected media files
                newItem.querySelectorAll('.ozz-fm__media-embed-wrapper').forEach(mediaWrapper => {
                    mediaWrapper.innerHTML = '';
                });

                // Reset Filter Dropdowns in cloned item
                newItem.querySelectorAll('[data-ozz-filter]').forEach(filterEl => {
                    delete filterEl.dataset.ozzFilterInited;
                    filterEl.selectedItems = [];

                    const tagsContainer = filterEl.querySelector('.ozz-tags-container');
                    if (tagsContainer) tagsContainer.remove();

                    const searchField = filterEl.querySelector('[data-ozz-filter-textfield]');
                    const hiddenField = filterEl.querySelector('[data-ozz-filter-hiddenfield]');
                    if (searchField) searchField.value = '';
                    if (hiddenField) hiddenField.value = '';

                    const dropdown = filterEl.querySelector('[data-ozz-filter-dropdown]');
                    if (dropdown) {
                        dropdown.classList.add('hidden');
                        Array.from(dropdown.getElementsByTagName('li')).forEach(opt => {
                            opt.classList.remove('selected');
                            opt.style.display = '';
                        });
                    }
                });

                newItem.querySelector('.ozz-fm__repeat-number').innerHTML = thisItemCount.length + 1;
                const titleEl = newItem.querySelector('.ozz-fm__repeat-title');
                if (titleEl) titleEl.innerHTML = '';
                newItem.querySelector('.ozz-fm__repeat-head')?.classList.remove('close');
                newItem.querySelector('.ozz-fm__repeat-body')?.classList.remove('close');

                // Init for child repeaters of clone
                repeater__addItem(newItem, bindEvents);
                repeater__deleteItem(newItem);

                // Init accordion
                repeater__Accordion(newItem);

                // Append new item
                thisWrapper.appendChild(newItem);

                // Update Names
                repeater__renameFields();

                // bind events for new item
                if (typeof bindEvents === 'function') {
                    bindEvents();
                }

                // Dispatch custom event when a row is added
                thisRepeater.dispatchEvent(new CustomEvent('ozzRepeater:add', {
                    bubbles: true,
                    detail: {
                        item: newItem,             // The newly created DOM element
                        repeater: thisRepeater,    // The repeater container
                        index: thisItemCount.length // Index of the new row
                    }
                }));
            });
        });
    }

    /**
     * Delete repeater Item
     */
    function repeater__deleteItem(DOM) {
        const deleteItemTrigger = DOM ? DOM.querySelectorAll('.ozz-fm__repeat-remove') : document.querySelectorAll('.ozz-fm__repeat-remove');
        deleteItemTrigger.forEach(deleteItem => {
            deleteItem.addEventListener('click', (e) => {
                e.preventDefault();
                // Delete Item
                const
                    thisFieldsetWrapper = deleteItem.closest('.ozz-fm__repeat-wrapper'),
                    thisFields = thisFieldsetWrapper?.querySelectorAll(':scope > .ozz-fm__repeat-fields');

                if (thisFields && thisFields.length > 1) {
                    const thisRepeater = thisFieldsetWrapper?.closest('.ozz-fm__repeat');
                    deleteItem.closest('.ozz-fm__repeat-fields').remove();
                    repeater__renameFields();

                    // Dispatch custom event when a row is deleted
                    if (thisRepeater) {
                        thisRepeater.dispatchEvent(new CustomEvent('ozzRepeater:delete', {
                            bubbles: true,
                            detail: {
                                repeater: thisRepeater,
                                remainingCount: thisFieldsetWrapper.querySelectorAll(':scope > .ozz-fm__repeat-fields').length
                            }
                        }));
                    }
                } else {
                    deleteItem.setAttribute('disabled', true);
                    return false;
                }
            });
        });
    }

    /**
     * Reset field name indexes of repeater
     */
    function repeater__renameFields(specificFieldSet = false) {
        const allWrappers = specificFieldSet !== false ? specificFieldSet : document.querySelectorAll('.ozz-fm__repeat-wrapper');
        allWrappers.forEach((wrapper) => {
            const
                thisRepeater = wrapper.closest('.ozz-fm__repeat'),
                thisFieldSet = wrapper.querySelectorAll(':scope > .ozz-fm__repeat-fields'),
                isSingle = thisRepeater.classList.contains('single'),
                rptName = thisRepeater.getAttribute('data-rpt'),
                rptNameParts = rptName.split('__'),
                rptNameOnly = rptNameParts[rptNameParts.length - 1];

            thisFieldSet.forEach((fieldSet, i) => {
                if (fieldSet) {
                    const itemIndex = !isSingle
                        ? fieldSet.querySelector(':scope > .ozz-fm__repeat-head .ozz-fm__repeat-number')
                        : fieldSet.querySelector(':scope > .ozz-fm__repeat-number');

                    if (itemIndex) {
                        itemIndex.innerHTML = i + 1;
                    }

                    if (isSingle === false) {
                        // Rename field names
                        const itemFields = fieldSet.querySelectorAll('input, textarea, button, progress, meter, select, datalist, [data-ozz-wyg]');
                        itemFields.forEach(elm => {
                            if (elm.name) {
                                const newName = elm.name.replace(new RegExp(`${rptNameOnly}__\\d+__`), `${rptNameOnly}__${i}__`);
                                elm.name = newName;

                                // if File, rename the embed element as well
                                if (elm.type === 'file') {
                                    if (elm.nextElementSibling && elm.nextElementSibling.dataset.ozzEmbed) {
                                        elm.nextElementSibling.setAttribute('data-ozz-embed', newName);
                                    }
                                }
                            } else if (elm.dataset.fieldName) {
                                const newDataAttr = elm.dataset.fieldName.replace(new RegExp(`${rptNameOnly}__\\d+__`), `${rptNameOnly}__${i}__`);
                                elm.setAttribute('data-field-name', newDataAttr);
                            }
                        });
                    }
                }
            });

            thisRepeater.dispatchEvent(new CustomEvent('ozzRepeater:reindex', {
                bubbles: true,
                detail: {
                    repeater: thisRepeater,
                    total: thisFieldSet.length
                }
            }));
        });
    }


    // ================================
    // Filter dropdown field
    // ================================
    /**
     * Initialize filter dropdown fields within a given container scope
     * @param {HTMLElement|Document} scope 
     */
    function initFilterDropdowns(scope = document) {
        const fields = scope.matches && scope.matches('[data-ozz-filter]')
            ? [scope]
            : Array.from(scope.querySelectorAll('[data-ozz-filter]'));

        if (fields.length === 0) return;

        fields.forEach(field => {
            // Prevent duplicate initialization on the same element
            if (field.dataset.ozzFilterInited === 'true') return;
            field.dataset.ozzFilterInited = 'true';

            const allowCustom = field.getAttribute('data-ozz-filter-allow-custom') === 'true';
            const isMultiple = field.getAttribute('data-ozz-filter-multiple') === 'true';

            const searchField = field.querySelector('[data-ozz-filter-textfield]');
            const hiddenField = field.querySelector('[data-ozz-filter-hiddenfield]');
            const dropdown = field.querySelector('[data-ozz-filter-dropdown]');
            const options = dropdown.getElementsByTagName('li');

            // Track selected items for multiple mode: [{ value: '...', text: '...' }]
            field.selectedItems = [];

            if (isMultiple) {
                searchField.placeholder = searchField.placeholder || "Select options...";

                // Inject a wrapper container for "tags" if it doesn't exist yet
                let tagsContainer = field.querySelector('.ozz-tags-container');
                if (!tagsContainer) {
                    tagsContainer = document.createElement('div');
                    tagsContainer.className = 'ozz-tags-container';
                    searchField.parentNode.insertBefore(tagsContainer, searchField);
                }

                // Sync visual active states if hiddenField already has default comma-separated values
                if (hiddenField.value) {
                    const initialValues = hiddenField.value.split(',');
                    
                    Array.from(options).forEach(opt => {
                        if (initialValues.includes(opt.getAttribute('data-value'))) {
                            opt.classList.add('selected');
                            field.selectedItems.push({
                                value: opt.getAttribute('data-value'),
                                text: opt.textContent.trim()
                            });
                        }
                    });
                    searchField.value = '';
                    filter__renderTags(tagsContainer, field.selectedItems, field);
                }
            } else {
                if (hiddenField.value) {
                    const matchedOption = Array.from(options).find(
                        opt => opt.getAttribute('data-value') === hiddenField.value
                    );

                    if (matchedOption) {
                        searchField.value = matchedOption.textContent.trim();
                    } else if (allowCustom) {
                        // If custom values are allowed, show the raw value
                        searchField.value = hiddenField.value;
                    }
                }
            }

            searchField.addEventListener('focus', () => {
                dropdown.classList.remove('hidden');
            });

            searchField.addEventListener('input', function() {
                const filter = this.value.toLowerCase();

                // Only update single-select hidden fields instantly on typing custom text
                if (allowCustom && !isMultiple) {
                    filter__updateHiddenValue(hiddenField, this.value);
                }

                for (let option of options) {
                    const text = option.textContent.toLowerCase();
                    if (text.includes(filter)) {
                        option.style.display = "";
                    } else {
                        option.style.display = "none";
                    }
                }
            });

            searchField.addEventListener('blur', function(e) {
                if (e.relatedTarget && dropdown.contains(e.relatedTarget)) return;

                // Multiple mode handles custom input validation differently
                if (isMultiple) {
                    if (allowCustom && this.value.trim() !== "") {
                        filter__addMultipleSelection(this.value.trim(), this.value.trim(), field, field.selectedItems);
                        this.value = "";
                        filter__resetDropdownFilters(options);
                    } else if (!allowCustom && this.value.trim() !== "") {
                        const matchedOption = Array.from(options).find(
                            opt => opt.textContent.trim().toLowerCase() === this.value.trim().toLowerCase()
                        );
                        if (matchedOption) {
                            filter__addMultipleSelection(matchedOption.getAttribute('data-value'), matchedOption.textContent.trim(), field, field.selectedItems);
                        }
                        this.value = "";
                        filter__resetDropdownFilters(options);
                    }
                    dropdown.classList.add('hidden');
                } else {
                    filter__validateAndCloseSingle(this, dropdown, hiddenField, options, allowCustom);
                }
            });

            dropdown.addEventListener('click', (e) => {
                if (e.target.tagName === 'LI') {
                    const val = e.target.getAttribute('data-value');
                    const txt = e.target.textContent.trim();

                    if (isMultiple) {
                        filter__addMultipleSelection(val, txt, field, field.selectedItems);
                        searchField.value = ""; // Clear input for next search
                        searchField.focus();   // Keep focus to chain selections
                        filter__resetDropdownFilters(options);
                    } else {
                        searchField.value = txt;
                        filter__updateHiddenValue(hiddenField, val);
                        dropdown.classList.add('hidden');
                    }
                }
            });

            // Dynamic dropdown values updating method
            field.updateOptions = (newOptions) => filter__updateDropdownOptions(field, newOptions);
        });
    }

    /**
     * Helper to add or toggle tags in multiple mode
     */
    function filter__addMultipleSelection(value, text, field, selectedItems) {
        const hiddenField = field.querySelector('[data-ozz-filter-hiddenfield]');
        const tagsContainer = field.querySelector('.ozz-tags-container');
        const dropdown = field.querySelector('[data-ozz-filter-dropdown]');
        const options = dropdown.getElementsByTagName('li');

        // Check if already selected to prevent duplicates
        const exists = selectedItems.some(item => item.value === value);
        if (!exists) {
            selectedItems.push({ value, text });

            // Highlight list item visually if it exists in the list
            const matchingLi = Array.from(options).find(opt => opt.getAttribute('data-value') === value);
            if (matchingLi) matchingLi.classList.add('selected');
        } else {
            // Toggle off if clicked a second time
            selectedItems.splice(selectedItems.findIndex(item => item.value === value), 1);
            const matchingLi = Array.from(options).find(opt => opt.getAttribute('data-value') === value);
            if (matchingLi) matchingLi.classList.remove('selected');
        }

        // Sync to hidden field as comma separated values
        filter__updateHiddenValue(hiddenField, selectedItems.map(item => item.value).join(','));
        filter__renderTags(tagsContainer, selectedItems, field);
    }

    /**
     * Helper to draw visual UI tags inside the container
     */
    function filter__renderTags(container, items, field) {
        container.innerHTML = '';
        items.forEach(item => {
            const tag = document.createElement('span');
            tag.className = 'ozz-tag';
            tag.innerHTML = `${item.text} <button type="button" class="btn remove-tag-btn" data-val="${item.value}">&times;</button>`;

            // Remove item event
            tag.querySelector('button').addEventListener('click', (e) => {
                e.stopPropagation();
                filter__addMultipleSelection(item.value, item.text, field, items);
            });
            container.appendChild(tag);
        });
    }

    /**
     * Validate and close single
     */
    function filter__validateAndCloseSingle(searchField, dropdown, hiddenField, options, allowCustom) {
        if (!allowCustom) {
            const matchedOption = Array.from(options).find(
                opt => opt.textContent.trim().toLowerCase() === searchField.value.trim().toLowerCase()
            );

            if (matchedOption) {
                searchField.value = matchedOption.textContent.trim();
                filter__updateHiddenValue(hiddenField, matchedOption.getAttribute('data-value'));
            } else if (searchField.value !== "") {
                searchField.value = "";
                filter__updateHiddenValue(hiddenField, "");
            }
        }
        dropdown.classList.add('hidden');
    }

    /**
     * Reset dropdown filters
     */
    function filter__resetDropdownFilters(options) {
        for (let option of options) {
            option.style.display = "";
        }
    }

    /**
     * Handle outside interaction
     */
    function filter__handleOutsideInteraction(e) {
        const activeContainer = e.target.closest('[data-ozz-filter]');
        document.querySelectorAll('[data-ozz-filter]').forEach(field => {
            const dropdown = field.querySelector('[data-ozz-filter-dropdown]');
            const searchField = field.querySelector('[data-ozz-filter-textfield]');
            const hiddenField = field.querySelector('[data-ozz-filter-hiddenfield]');
            const options = dropdown.getElementsByTagName('li');
            const allowCustom = field.getAttribute('data-ozz-filter-allow-custom') === 'true';
            const isMultiple = field.getAttribute('data-ozz-filter-multiple') === 'true';

            if (!activeContainer || field !== activeContainer) {
                if (!dropdown.classList.contains('hidden')) {
                    if (isMultiple) {
                        searchField.dispatchEvent(new Event('blur'));
                    } else {
                        filter__validateAndCloseSingle(searchField, dropdown, hiddenField, options, allowCustom);
                    }
                }
            } else {
                if (e.target === searchField) {
                    dropdown.classList.remove('hidden');
                }
            }
        });
    }

    /**
     * Dynamically updates the option list inside a filter dropdown
     * @param {HTMLElement} field - The main element with [data-ozz-filter]
     * @param {Array} newOptions - Array of items: [{ value: '1', text: 'Option 1' }]
     */
    function filter__updateDropdownOptions(field, newOptions) {
        const dropdown = field.querySelector('[data-ozz-filter-dropdown]');
        const hiddenField = field.querySelector('[data-ozz-filter-hiddenfield]');
        const searchField = field.querySelector('[data-ozz-filter-textfield]');
        const isMultiple = field.getAttribute('data-ozz-filter-multiple') === 'true';

        dropdown.innerHTML = '';
        newOptions.forEach(opt => {
            const li = document.createElement('li');
            li.setAttribute('data-value', opt.value);
            li.textContent = opt.text;
            dropdown.appendChild(li);
        });

        // Clear values/tags to prevent mismatch stale states
        filter__updateHiddenValue(hiddenField, '');
        searchField.value = '';

        if (isMultiple) {
            field.selectedItems = [];
            const tagsContainer = field.querySelector('.ozz-tags-container');
            if (tagsContainer) tagsContainer.innerHTML = '';
        }
    }

    /**
     * Helper to safely update hidden fields and dispatch programmatic events
     */
    function filter__updateHiddenValue(hiddenField, newValue) {
        if (hiddenField.value !== newValue) {
            hiddenField.value = newValue;

            // Dispatch standard 'change' event
            hiddenField.dispatchEvent(new Event('change', { bubbles: true }));

            // Dispatch a richer Custom Event for deep integrations
            hiddenField.dispatchEvent(new CustomEvent('ozzFilter:change', { 
                bubbles: true,
                detail: { value: newValue }
            }));
        }
    }


    // ================================
    // File upload Live preview
    // ================================
    function initFileUploadLivePreview(scope = document) {
        const fileFields = scope.querySelectorAll('[data-ozz-file]');
        if (fileFields.length === 0) return;

        fileFields.forEach(field => {
            const targetId = field.name;
            const embedDOM = scope.querySelector(`[data-ozz-embed="${CSS.escape(targetId)}"]`);

            if (!embedDOM) return;

            let accumulatedFiles = []; // For newly picked File objects
            let existingFiles = [];    // For server-rendered image URLs
            let isInternalSync = false; 

            // Parse initial/existing image URLs from a data attribute
            const initialData = field.getAttribute('data-file-value');
            if (initialData) {
                try {
                    const urls = JSON.parse(initialData);
                    if (urls.length === 0) return;
                    existingFiles = urls.map(url => ({
                        id: `existing-${Math.random().toString(36).substr(2, 9)}`,
                        url: url,
                        isExisting: true
                    }));
                } catch (e) {
                    console.error('Invalid JSON in data-file-value', e);
                }
            }

            // Render previews on page load
            renderPreviews();

            field.addEventListener('change', (event) => {
                if (isInternalSync || (event.detail && event.detail.ozzBypass)) return;

                const incomingFiles = Array.from(event.target.files);
                if (incomingFiles.length === 0) return;

                const maxFilesAttr = field.getAttribute('data-ozz-max-files');
                const maxFiles = maxFilesAttr ? parseInt(maxFilesAttr, 10) : Infinity;

                const uniqueIncomingFiles = incomingFiles.map(file => ({
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    file: file,
                    isExisting: false
                }));

                // Account for existing items when checking limits
                const totalCurrent = accumulatedFiles.length + existingFiles.length;
                const slotsRemaining = maxFiles - totalCurrent;

                if (slotsRemaining <= 0) {
                    alert(`Maximum limit of ${maxFiles} files reached.`);
                    syncInputFiles(field, accumulatedFiles); 
                    return;
                }

                if (uniqueIncomingFiles.length > slotsRemaining) {
                    accumulatedFiles = accumulatedFiles.concat(uniqueIncomingFiles.slice(0, slotsRemaining));
                } else {
                    accumulatedFiles = accumulatedFiles.concat(uniqueIncomingFiles);
                }

                syncInputFiles(field, accumulatedFiles);
                renderPreviews();
            });

            function renderPreviews() {
                // Clean up blob URLs for newly uploaded files only
                const existingImgs = embedDOM.querySelectorAll('img[data-ozz-blob]');
                existingImgs.forEach(img => URL.revokeObjectURL(img.getAttribute('data-ozz-blob')));
                embedDOM.innerHTML = '';

                // Combine existing files and new uploads for rendering
                const allItems = [...existingFiles, ...accumulatedFiles];

                allItems.forEach((trackedItem) => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'ozz-preview-item';
                    wrapper.style.position = 'relative';

                    if (trackedItem.isExisting) {
                        // Render existing server URL
                        const img = document.createElement('img');
                        img.src = trackedItem.url;
                        img.className = 'ozz-preview-img';
                        wrapper.appendChild(img);
                    } else {
                        // Render newly picked File object
                        const file = trackedItem.file;
                        if (file.type.startsWith('image/')) {
                            const img = document.createElement('img');
                            const objectUrl = URL.createObjectURL(file);
                            img.src = objectUrl;
                            img.alt = file.name;
                            img.className = 'ozz-preview-img';
                            img.setAttribute('data-ozz-blob', objectUrl); 
                            wrapper.appendChild(img);
                        } else {
                            const fileIconCard = document.createElement('div');
                            fileIconCard.className = 'ozz-preview-file-card';
                            fileIconCard.innerHTML = `
                                <span class="ozz-file-name">${escapeHTML(file.name)}</span>
                                <span class="ozz-file-size">(${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            `;
                            wrapper.appendChild(fileIconCard);
                        }
                    }

                    const removeBtn = document.createElement('button');
                    removeBtn.type = 'button';
                    removeBtn.className = 'ozz-remove-btn';
                    removeBtn.innerHTML = '&times;';

                    removeBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation(); 

                        if (trackedItem.isExisting) {
                            // Remove from existing list
                            existingFiles = existingFiles.filter(item => item.id !== trackedItem.id);
                            
                            // Append a hidden input so backend knows this existing ID/URL was deleted
                            const deletedInput = document.createElement('input');
                            deletedInput.type = 'hidden';
                            deletedInput.name = `removed_${targetId}[]`;
                            deletedInput.value = trackedItem.url;
                            embedDOM.parentElement.appendChild(deletedInput);
                        } else {
                            // Remove from newly uploaded list
                            accumulatedFiles = accumulatedFiles.filter(item => item.id !== trackedItem.id);
                            syncInputFiles(field, accumulatedFiles);
                        }

                        renderPreviews();

                        field.dispatchEvent(new CustomEvent('change', { 
                            detail: { ozzBypass: true } 
                        }));
                    });

                    wrapper.appendChild(removeBtn);
                    embedDOM.appendChild(wrapper);
                });
            }

            function syncInputFiles(inputElement, trackedFilesArray) {
                isInternalSync = true; 
                const dt = new DataTransfer();
                trackedFilesArray.forEach(tracked => dt.items.add(tracked.file));
                inputElement.files = dt.files;
                isInternalSync = false; 
            }
        });

        function escapeHTML(str) {
            return str.replace(/[&<>'"]/g, 
                tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
            );
        }
    }


    // ================================
    // Conditionally render/update fields based on other field values
    // ================================
    /**
     * Initialize conditional logic across the form or within a specific container scope
     * @param {HTMLElement|Document} scope 
     */
    function initConditionalRendering(scope = document) {
        // Find all fields with data-condition attributes within scope
        const conditionedFields = scope.querySelectorAll 
            ? scope.querySelectorAll('[data-condition]') 
            : [];

        if (conditionedFields.length === 0) return;

        conditionedFields.forEach(targetEl => {
            // Prevent duplicate initialization on the same field
            if (targetEl.dataset.ozzConditionInited === 'true') return;
            targetEl.dataset.ozzConditionInited = 'true';

            let conditionData = null;
            try {
                conditionData = JSON.parse(targetEl.getAttribute('data-condition'));
            } catch (e) {
                console.error('Invalid JSON in data-condition on element:', targetEl, e);
                return;
            }
            
            if (!conditionData) return;

            // Extract all target dependent field IDs or names to attach event listeners
            const dependentFieldKeys = condition__extractDependencies(conditionData);

            // Bind change and input listeners to dependencies
            dependentFieldKeys.forEach(depKey => {
                const sourceElements = condition__findSourceElements(depKey, targetEl);
                sourceElements.forEach(sourceEl => {
                    const eventType = (sourceEl.tagName === 'INPUT' && ['text', 'email', 'number', 'search'].includes(sourceEl.type)) 
                        ? 'input' 
                        : 'change';

                    sourceEl.addEventListener(eventType, () => {
                        condition__evaluateAndApply(targetEl, conditionData);
                    });
                });
            });

            // Initial evaluation on setup
            condition__evaluateAndApply(targetEl, conditionData);
        });
    }

    /**
     * Recursively extract dependent field IDs/names from condition schema
     */
    function condition__extractDependencies(conditionData) {
        let deps = [];

        if (conditionData.target) {
            deps.push(conditionData.target);
        }

        if (conditionData.conditions && Array.isArray(conditionData.conditions.rules)) {
            conditionData.conditions.rules.forEach(rule => {
                if (rule.target) deps.push(rule.target);
                if (rule.field) deps.push(rule.field);
                if (rule.conditions) {
                    deps = deps.concat(condition__extractDependencies(rule));
                }
            });
        }

        return [...new Set(deps)];
    }

    /**
     * Resolve source element: Scopes inside the same repeater row first, then falls back to global document
     */
    function condition__findSourceElements(key, targetEl) {
        // If target is inside a repeater row, check inside that row first
        const repeaterRow = targetEl.closest('.ozz-fm__repeat-fields');

        if (repeaterRow) {
            function rebuildName(targetElmName, str) {
                const lastIndex = targetElmName.lastIndexOf("__");
                let nm = lastIndex !== -1 ? targetElmName.slice(0, lastIndex) : targetElmName;
                return nm + '__' + key;
            }
            const fieldName = rebuildName(targetEl.name, key);
            console.log( fieldName );
            
            const rowElements = repeaterRow.querySelectorAll(`[name="${fieldName}"], [data-field-name="${fieldName}"]`);
            if (rowElements.length > 0) return Array.from(rowElements);
        }

        // Global fallback if not found in current repeater scope
        const globalElements = document.querySelectorAll(`[name="${key}"], [data-field-name="${key}"]`);
        return Array.from(globalElements);
    }

    /**
     * Reads current value of a source element (supports inputs, selects, custom filter dropdowns)
     */
    function condition__getFieldValue(key, targetEl) {
        const sources = condition__findSourceElements(key, targetEl);
        if (sources.length === 0) return null;

        const sourceEl = sources[0];

        // Check if source is a custom filter dropdown component
        const filterWrapper = sourceEl.closest('[data-ozz-filter]');
        if (filterWrapper) {
            const hiddenField = filterWrapper.querySelector('[data-ozz-filter-hiddenfield]');
            const isMultiple = filterWrapper.getAttribute('data-ozz-filter-multiple') === 'true';
            
            if (hiddenField && hiddenField.value) {
                return isMultiple ? hiddenField.value.split(',') : hiddenField.value;
            }
            return isMultiple ? [] : '';
        }

        // Native Select Multiple
        if (sourceEl.tagName === 'SELECT' && sourceEl.multiple) {
            return Array.from(sourceEl.selectedOptions).map(opt => opt.value);
        }

        // Checkbox group or Radio
        if (sourceEl.type === 'checkbox' || sourceEl.type === 'radio') {
            const checked = sources.filter(el => el.checked);
            if (sourceEl.type === 'radio') {
                return checked.length > 0 ? checked[0].value : '';
            }
            return checked.map(el => el.value);
        }

        return sourceEl.value;
    }

    /**
     * Evaluates condition logic (Supports single condition and nested AND/OR rules)
     */
    function condition__evaluate(conditionData, targetEl) {
        // Case A: Multi-condition group structure
        if (conditionData.conditions && Array.isArray(conditionData.conditions.rules)) {
            const relation = (conditionData.conditions.relation || 'AND').toUpperCase();
            const results = conditionData.conditions.rules.map(rule => {
                if (rule.conditions) {
                    return condition__evaluate({ conditions: rule }, targetEl);
                }
                return condition__evaluateSingleRule(rule, targetEl);
            });

            return relation === 'AND' 
                ? results.every(Boolean) 
                : results.some(Boolean);
        }

        // Case B: Single rule structure
        return condition__evaluateSingleRule(conditionData, targetEl);
    }

    /**
     * Single rule comparison logic
     */
    function condition__evaluateSingleRule(rule, targetEl) {
        const targetKey = rule.target || rule.field;
        if (!targetKey) return true;

        const actualValue = condition__getFieldValue(targetKey, targetEl);
        const op = rule.operator || rule.condition || 'equals';
        const expectedValue = rule.value;

        switch (op) {
            case 'equals':
            case '==':
                return actualValue == expectedValue;

            case 'not_equals':
            case '!=':
                return actualValue != expectedValue;

            case 'contains':
                if (Array.isArray(actualValue)) return actualValue.includes(expectedValue);
                return String(actualValue).toLowerCase().includes(String(expectedValue).toLowerCase());

            case 'not_contains':
                if (Array.isArray(actualValue)) return !actualValue.includes(expectedValue);
                return !String(actualValue).toLowerCase().includes(String(expectedValue).toLowerCase());

            case 'not_empty':
            case 'filled':
                if (Array.isArray(actualValue)) return actualValue.length > 0;
                return actualValue !== null && actualValue !== undefined && String(actualValue).trim() !== '';

            case 'is_empty':
            case 'blank':
                if (Array.isArray(actualValue)) return actualValue.length === 0;
                return actualValue === null || actualValue === undefined || String(actualValue).trim() === '';

            case 'greater_than':
            case '>':
                return Number(actualValue) > Number(expectedValue);

            case 'less_than':
            case '<':
                return Number(actualValue) < Number(expectedValue);
            case 'greater_than_or_equal':
            case '>=':
                return Number(actualValue) >= Number(expectedValue);

            case 'less_than_or_equal':
            case '<=':
                return Number(actualValue) <= Number(expectedValue);

            default:
                return true;
        }
    }

    /**
     * Enables or disables all form inputs within a container.
     */
    function condition__toggleInputs(container, disable) {
        const inputs = container.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (disable) {
                input.setAttribute('disabled', 'disabled');
            } else {
                input.removeAttribute('disabled');
            }
        });
    }

    /**
     * Executes appropriate visual/DOM action based on condition result
     */
    function condition__evaluateAndApply(targetEl, conditionData) {
        const isMatched = condition__evaluate(conditionData, targetEl);
        const action = conditionData.action || conditionData.condition;
        const wrapper = targetEl.closest('.ozz-fm__field') || targetEl;

        switch (action) {
            case 'changeOptions':
            case 'updateOptions':
                const sourceKey = conditionData.target || (conditionData.conditions?.rules[0]?.field);
                const parentValue = condition__getFieldValue(sourceKey, targetEl);
                
                let newOpts = [];
                if (conditionData.options && parentValue && conditionData.options[parentValue]) {
                    const rawOpts = conditionData.options[parentValue];
                    
                    // Normalize options array into [{ value: '...', text: '...' }]
                    if (Array.isArray(rawOpts)) {
                        newOpts = rawOpts.map(val => ({ value: val, text: val }));
                    } else if (typeof rawOpts === 'object') {
                        newOpts = Object.entries(rawOpts).map(([val, txt]) => ({ value: val, text: txt }));
                    }
                }

                // If element is a custom Filter Dropdown
                const filterContainer = targetEl.matches('[data-ozz-filter]') 
                    ? targetEl 
                    : targetEl.closest('[data-ozz-filter]');

                if (filterContainer && typeof filterContainer.updateOptions === 'function') {
                    filterContainer.updateOptions(newOpts);
                } else if (targetEl.tagName === 'SELECT') {
                    // Standard <select> element update
                    targetEl.innerHTML = '';
                    newOpts.forEach(opt => {
                        const optionEl = document.createElement('option');
                        optionEl.value = opt.value;
                        optionEl.textContent = opt.text;
                        targetEl.appendChild(optionEl);
                    });
                }
                break;

            case 'show':
                wrapper.style.display = isMatched ? '' : 'none';
                condition__toggleInputs(wrapper, !isMatched);
                break;

            case 'hide':
                wrapper.style.display = isMatched ? 'none' : '';
                condition__toggleInputs(wrapper, isMatched);
                break;

            case 'enable':
                targetEl.removeAttribute('disabled');
                break;

            case 'disable':
                if (isMatched) {
                    targetEl.setAttribute('disabled', 'disabled');
                } else {
                    targetEl.removeAttribute('disabled');
                }
                break;
        }
    }


    // Init functions
    document.addEventListener('DOMContentLoaded', () => {
        initRepeater();
        initFilterDropdowns();
        initFileUploadLivePreview();
        initConditionalRendering();

        // Global listeners for outside interactions
        document.addEventListener('focusin', filter__handleOutsideInteraction);
        document.addEventListener('click', filter__handleOutsideInteraction);

        // Custom event binding for dynamically added repeater items
        document.addEventListener('ozzRepeater:add', (e) => {
            initFilterDropdowns(e.detail.item);
            initFileUploadLivePreview(e.detail.item);
            initConditionalRendering(e.detail.item);
        });
    });
})();