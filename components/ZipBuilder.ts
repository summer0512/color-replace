import JSZip from 'jszip';

class ZipBuilder {
    private zip: JSZip;

    constructor() {
        this.zip = new JSZip();
    }

    addFilesFromCanvases(canvasList: HTMLCollectionOf<HTMLCanvasElement>) {
        Array.from(canvasList).forEach((canvas, index) => {
            const imgData = canvas.toDataURL('image/png');
            this.zip.file(`image-${index + 1}.png`, imgData.split(',')[1], { base64: true });
        });
        return this;
    }

    build() {
        return this.zip.generateAsync({ type: 'blob' });
    }
}

export default ZipBuilder;