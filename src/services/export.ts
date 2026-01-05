import html2pdf from 'html2pdf.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Note } from '../types';

export const ExportService = {
    exportToPDF: async (elementId: string, filename: string) => {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Export element not found');
            return;
        }

        const opt = {
            margin: 10,
            filename: `${filename}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        } as any;

        try {
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('PDF Export failed:', error);
        }
    },

    exportAllToZip: async (notes: Note[]) => {
        const zip = new JSZip();

        notes.forEach(note => {
            const safeTitle = note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || `note_${note.id}`;
            const content = `# ${note.title}\n\nDate: ${new Date(note.updatedAt).toLocaleDateString()}\nCategory: ${note.category}\n\n${note.content}`;

            // Add markdown file
            zip.file(`${safeTitle}.md`, content);

            // If we have sketch data, we could export it too, but maybe as JSON for now?
            if (note.sketchData) {
                zip.file(`${safeTitle}.sketch.json`, note.sketchData);
            }
        });

        try {
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `premium_notes_backup_${new Date().toISOString().slice(0, 10)}.zip`);
        } catch (error) {
            console.error('Zip Export failed:', error);
        }
    }
};
