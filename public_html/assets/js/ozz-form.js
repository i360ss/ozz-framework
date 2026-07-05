(() => {

    // ================================
    // Repeater
    // ================================
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

                    // Enable delete button if disabled
                    [thisItem, newItem].forEach(element => {
                        element.querySelector('.ozz-fm__repeat-remove').removeAttribute('disabled');
                    });
                });

                // Clear selected media files
                newItem.querySelectorAll('.ozz-fm__media-embed-wrapper').forEach(mediaWrapper => {
                    mediaWrapper.innerHTML = '';
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
                    deleteItem.closest('.ozz-fm__repeat-fields').remove();
                    repeater__renameFields();
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
                            } else if (elm.dataset.fieldName) {
                                const newDataAttr = elm.dataset.fieldName.replace(new RegExp(`${rptNameOnly}__\\d+__`), `${rptNameOnly}__${i}__`);
                                elm.setAttribute('data-field-name', newDataAttr);
                            }
                        });
                    }
                }
            });
        });
    }


    // ================================
    // Filter dropdown field
    // ================================
    function initiFilterDropdowns() {
        const fields = document.querySelectorAll('[data-ozz-filter]');
        if (fields.length === 0) return;

        fields.forEach(field => {
            const allowCustom = field.getAttribute('data-ozz-filter-allow-custom') === 'true';
            const isMultiple = field.getAttribute('data-ozz-filter-multiple') === 'true';

            const searchField = field.querySelector('[data-ozz-filter-textfield]');
            const hiddenField = field.querySelector('[data-ozz-filter-hiddenfield]');
            const dropdown = field.querySelector('[data-ozz-filter-dropdown]');
            const options = dropdown.getElementsByTagName('li');

            // Track selected items for multiple mode: [{ value: '...', text: '...' }]
            let selectedItems = [];

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
                            selectedItems.push({
                                value: opt.getAttribute('data-value'),
                                text: opt.textContent.trim()
                            });
                        }
                    });
                    filter__renderTags(tagsContainer, selectedItems, field);
                }
            }

            searchField.addEventListener('focus', () => {
                dropdown.classList.remove('hidden');
            });

            searchField.addEventListener('input', function() {
                const filter = this.value.toLowerCase();

                // Only update single-select hidden fields instantly on typing custom text
                if (allowCustom && !isMultiple) {
                    hiddenField.value = this.value;
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
                        filter__addMultipleSelection(this.value.trim(), this.value.trim(), field, selectedItems);
                        this.value = "";
                        filter__resetDropdownFilters(options);
                    } else if (!allowCustom && this.value.trim() !== "") {
                        const matchedOption = Array.from(options).find(
                            opt => opt.textContent.trim().toLowerCase() === this.value.trim().toLowerCase()
                        );
                        if (matchedOption) {
                            filter__addMultipleSelection(matchedOption.getAttribute('data-value'), matchedOption.textContent.trim(), field, selectedItems);
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
                        filter__addMultipleSelection(val, txt, field, selectedItems);
                        searchField.value = ""; // Clear input for next search
                        searchField.focus();   // Keep focus to chain selections
                        filter__resetDropdownFilters(options);
                    } else {
                        searchField.value = txt;
                        hiddenField.value = val;
                        dropdown.classList.add('hidden');
                    }
                }
            });
        });

        document.addEventListener('focusin', filter__handleOutsideInteraction);
        document.addEventListener('click', filter__handleOutsideInteraction);
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
        hiddenField.value = selectedItems.map(item => item.value).join(',');
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
                hiddenField.value = matchedOption.getAttribute('data-value');
            } else if (searchField.value !== "") {
                searchField.value = "";
                hiddenField.value = "";
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


    // Init functions
    document.addEventListener('DOMContentLoaded', () => {
        initRepeater();
        initiFilterDropdowns();
    });
})();