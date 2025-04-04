document.addEventListener('DOMContentLoaded', function() {
    // Display current date
    const currentDateElement = document.getElementById('currentDate');
    const today = new Date();
    currentDateElement.textContent = today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    // Initialize journal entries from localStorage
    let journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    
    // Form submission handler
    const journalForm = document.getElementById('journalForm');
    journalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const title = document.getElementById('entryTitle').value;
        const content = document.getElementById('entryContent').value;
        const mood = document.getElementById('entryMood').value;
        const date = new Date();
        
        // Create new entry object
        const newEntry = {
            id: Date.now(), // unique ID using timestamp
            title: title,
            content: content,
            mood: mood,
            date: date.toISOString()
        };
        
        // Add entry to array and save to localStorage
        journalEntries.unshift(newEntry); // Add to beginning of array
        localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
        
        // Reset form
        journalForm.reset();
        
        // Refresh entries display
        displayEntries();
        
        // Show confirmation
        alert('Journal entry saved successfully!');
    });
    
    // Filter entries by mood
    const filterMood = document.getElementById('filterMood');
    filterMood.addEventListener('change', displayEntries);
    
    // Function to display entries
    function displayEntries() {
        const entriesList = document.getElementById('entriesList');
        const selectedMood = document.getElementById('filterMood').value;
        
        // Clear current entries
        entriesList.innerHTML = '';
        
        // Filter entries if needed
        const filteredEntries = selectedMood === 'all' 
            ? journalEntries 
            : journalEntries.filter(entry => entry.mood === selectedMood);
        
        // Check if there are any entries to display
        if (filteredEntries.length === 0) {
            entriesList.innerHTML = '<p class="empty-state">No entries found. Try changing the filter or add a new entry.</p>';
            return;
        }
        
        // Display entries
        filteredEntries.forEach(entry => {
            const entryDate = new Date(entry.date);
            const formattedDate = entryDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const entryCard = document.createElement('div');
            entryCard.className = `entry-card mood-${entry.mood}`;
            entryCard.dataset.id = entry.id;
            
            entryCard.innerHTML = `
                <div class="entry-header">
                    <span class="entry-title">${entry.title}</span>
                    <span class="entry-date">${formattedDate}</span>
                </div>
                <div class="entry-content">${entry.content}</div>
                <div class="entry-footer">
                    <span class="entry-mood">Mood: ${entry.mood}</span>
                    <button class="btn-delete" data-id="${entry.id}">Delete</button>
                </div>
            `;
            
            entriesList.appendChild(entryCard);
        });
        
        // Add event listeners to delete buttons
        const deleteButtons = document.querySelectorAll('.btn-delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const entryId = parseInt(this.dataset.id);
                deleteEntry(entryId);
            });
        });
    }
    
    // Function to delete an entry
    function deleteEntry(id) {
        if (confirm('Are you sure you want to delete this entry?')) {
            journalEntries = journalEntries.filter(entry => entry.id !== id);
            localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
            displayEntries();
        }
    }
    
    // Initial display of entries
    displayEntries();
});