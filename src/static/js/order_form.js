document.addEventListener('DOMContentLoaded', function() {

    // Function for binding handlers to delete buttons for new rows
    function bindRemoveButtons() {
        document.querySelectorAll('.remove-dish').forEach(function(button) {
            // Delete the previous handler so that we don't have to hang it several times
            button.removeEventListener('click', removeNewRowHandler);
            button.addEventListener('click', removeNewRowHandler);
        });
    }

    // Handler for the delete row button (for new rows without DELETE field)
    function removeNewRowHandler() {
        var dishRow = this.closest('.dish-row');
        if (!dishRow) return;

        // If there is a DELETE field in the string, we consider it to be a saved string - then we do not process it here.
        var deleteInput = dishRow.querySelector('input[name$="-DELETE"]');
        if (deleteInput) {
            return;
        } else {
            // New line: check the number of lines
            var dishRows = document.querySelectorAll('#dish-formset .dish-row');
            if (dishRows.length > 1) {
                dishRow.parentNode.removeChild(dishRow);
                var totalFormsInput = document.querySelector('input[name="form-TOTAL_FORMS"]');
                if (totalFormsInput) {
                    totalFormsInput.value = parseInt(totalFormsInput.value) - 1;
                }
            } else {
                // If this is the last line, clear all its fields (set '1' for the quantity field).
                dishRow.querySelectorAll('input').forEach(function(input) {
                    if (input.getAttribute('name').includes('quantity')) {
                        input.value = '1';
                    } else {
                        input.value = '';
                    }
                });
            }
        }
    }

    // Bind handlers for the buttons of deleting existing new rows
    bindRemoveButtons();

    // Handler for the add new line button
    var addDishBtn = document.getElementById('add-dish');
    if (addDishBtn) {
        addDishBtn.addEventListener('click', function() {
            var dishFormset = document.getElementById('dish-formset');
            var totalFormsInput = document.querySelector('input[name="form-TOTAL_FORMS"]');
            var currentFormCount = parseInt(totalFormsInput.value);

            // Clone the first line as a template
            var template = dishFormset.firstElementChild;
            var newForm = template.cloneNode(true);

            // Delete from the clone only the elements associated with the deletion (DELETE field and label)
            var deleteInput = newForm.querySelector('input[name$="-DELETE"]');
            if (deleteInput && deleteInput.parentNode) {
                deleteInput.parentNode.removeChild(deleteInput);
            }
            var deleteLabel = newForm.querySelector('label[for="' + (deleteInput ? deleteInput.id : '') + '"]');
            if (deleteLabel && deleteLabel.parentNode) {
                deleteLabel.parentNode.removeChild(deleteLabel);
            }

            // Update the name/id attributes and clear the values in a new line
            var inputs = newForm.querySelectorAll('input');
            inputs.forEach(function(input) {
                var nameAttr = input.getAttribute('name');
                if (nameAttr) {
                    var newName = nameAttr.replace(/form-\d+-/, 'form-' + currentFormCount + '-');
                    input.setAttribute('name', newName);
                    input.setAttribute('id', 'id_' + newName);
                    if (nameAttr.includes('quantity')) {
                        input.value = '1';
                    } else {
                        input.value = '';
                    }
                }
            });

            // If the clone already has a remove button (with the .remove-dish class), leave it in.
            // If not, we add it.
            if (!newForm.querySelector('.remove-dish')) {
                var removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'remove-dish';
                removeBtn.textContent = '–';
                newForm.appendChild(removeBtn);
            }

            dishFormset.appendChild(newForm);
            totalFormsInput.value = currentFormCount + 1;

            // Bind handlers to the delete buttons, including a new line
            bindRemoveButtons();
        });
    }
});
