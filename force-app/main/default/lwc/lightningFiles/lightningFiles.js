import { api, LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getMimeTypeFromExtension } from './utils';
import { fileTypesMap } from './utils';
import getFiles from '@salesforce/apex/lightningFilesHelper.getFiles'
import isCommunity from '@salesforce/apex/lightningFilesHelper.isCommunity'
import renameFiles from '@salesforce/apex/lightningFilesHelper.renameFiles'

export default class LightningFiles extends NavigationMixin(LightningElement) {
     @api recordId
     @api showUploadButton
     @api showPreviewInFlow
     @api fileName = ''
     isCom = false
     files = []

     get title() {
          return `Files (${this.len})`
     }

     async connectedCallback() {
          await this.setFiles()
          this.isCom = await isCommunity()
     }

     get getBaseUrl(){
          let baseUrl = 'https://'+location.host+'/';
          return baseUrl;
     }

     async setFiles() {
          this.files = (await getFiles({ recordId:this.recordId })).map(f =>{
               f.icon = `doctype:${fileTypesMap(f.FileExtension)}`
               return f
          })


          this.len = this.files.length
     }
    
     async onUploadFinish(event) {
          console.log('Success')

          const contentVersionIds = event.detail.files.map(f => f.contentVersionId)

          if (this.fileName && contentVersionIds.length) {
               await renameFiles({ contentVersionIds, name: this.fileName })
          }

          this.setFiles()
          this.successToast('File Uploaded')
          this.dispatchEvent(new CustomEvent('uploaded'))
     }

     viewFile(event) {
          const ContentDocumentId = event.currentTarget.dataset.id
  
          // console.log({ ContentDocumentId })
  
          if(this.isCom) {
              this[NavigationMixin.Navigate]({
                    type: 'standard__webPage',
                    attributes: {
                         url:this.getBaseUrl + ContentDocumentId
                    }
              }, false )
              .then(url => { window.open(url) });
          } else {
  
              this[NavigationMixin.Navigate]({
                    type: 'standard__namedPage',
                    attributes: {
                              pageName: 'filePreview'
                    },
                    state : {
                         selectedRecordId: ContentDocumentId
                    }
              }, false )
              .then(url => { window.open(url) });
          }
     }
    

     // handleFile(event) {
     //      const id = event.currentTarget.dataset.id

     //      console.log({ id })

     //      this[NavigationMixin.Navigate]({
     //           type: 'standard__namedPage',
     //           attributes: {
     //                pageName: 'filePreview'
     //           },
     //           state : {
     //                recordIds: id
     //           }
     //      })
     // }

     successToast(m) {
          this.dispatchEvent(
               new ShowToastEvent({
                    title: 'Success',
                    message: m,
                    variant: 'success',
               })
          );
     }
}