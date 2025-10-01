/**
 * ResumeDataLoader
 * Loads resume data from a JSON file at assets/data/resume.json
 * Falls back gracefully if the file is unavailable.
 */
(function(global) {
    function load() {
        return fetch('assets/data/resume.json', { cache: 'no-store' })
            .then(function(res) {
                if (!res.ok) throw new Error('Failed to load resume.json');
                return res.json();
            });
    }

    global.ResumeDataLoader = { load: load };
})(window);




