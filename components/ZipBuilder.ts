import JSZip from 'jszip';

class ZipBuilder {
    private zip: JSZip;

    constructor() {
        this.zip = new JSZip();
    }

    addCanvas(fileName: string, canvas: HTMLCanvasElement) {
        const imgData = canvas.toDataURL('image/png');
        if (!imgData.startsWith('data:image/png;base64,') || !imgData.split(',')[1]) {
            throw new Error('Empty image data');
        }
        this.zip.file(fileName, imgData.split(',')[1], { base64: true });
        return this;
    }

    build() {
        return this.zip.generateAsync({ type: 'blob' });
    }
}

export default ZipBuilder;
