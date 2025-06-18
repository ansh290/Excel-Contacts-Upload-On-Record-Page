import { LightningElement,api} from 'lwc';
import xlsxLib from '@salesforce/resourceUrl/xlsx';
import { loadScript } from 'lightning/platformResourceLoader';
import insertCont from '@salesforce/apex/insertContacts.insertCont'; // ✅ Correct method name

export default class ExcelAccountImporter extends LightningElement {
    @api recordId;
    xlsxInitialized = false;

    connectedCallback() {
        loadScript(this, xlsxLib)
            .then(() => {
                if (window.XLSX && typeof window.XLSX.read === 'function') {
                    console.log('✅ SheetJS loaded');
                    this.xlsxInitialized = true;
                } else {
                    console.error('❌ XLSX is not attached to window');
                }
            })
            .catch((error) => {
                console.error('❌ Error loading SheetJS:', error);
            });
    }

    handleFileChange(event) {
        if (!this.xlsxInitialized) {
            alert('SheetJS not loaded yet.');
            return;
        }


        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = window.XLSX.read(data, { type: 'array' });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = window.XLSX.utils.sheet_to_json(sheet);

            console.log('Parsed Excel JSON:', JSON.stringify(json, null, 2));

            insertCont({ contactList: json, accountId:this.recordId })
                .then(result => {
                    console.log(result);
                    alert(result);
                })
                .catch(error => {
                    console.log(error);
                    alert('Error: ' + error.body.message);
                });
        };

        reader.readAsArrayBuffer(file);
    }
}