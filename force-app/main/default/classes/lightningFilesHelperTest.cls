/**
 * cretaed/written by Reid Efford - https://github.com/effordDev
 */
@isTest
public with sharing class lightningFilesHelperTest {
    @IsTest
    public static void getFilesTest(){
        
        Contact contact = new Contact();
            contact.LastName = 'mr.File';
        insert contact;

        ContentVersion contentVersion = new ContentVersion();
            contentVersion.Title = 'Cat';
            contentVersion.PathOnClient = 'meow.jpg';
            contentVersion.VersionData = Blob.valueOf('I am Cat');
            contentVersion.IsMajorVersion = true;
        insert contentVersion; 

        List<ContentDocument> documents = [SELECT Id, Title, LatestPublishedVersionId FROM ContentDocument];
        
        ContentDocumentLink cdl = new ContentDocumentLink();
            cdl.LinkedEntityId = contact.Id;
            cdl.ContentDocumentId = documents[0].Id;
            cdl.shareType = 'V';
        insert cdl;

        lightningFilesHelper.getFiles([SELECT Id FROM Contact LIMIT 1].Id);
        lightningFilesHelper.isCommunity();
    }
}