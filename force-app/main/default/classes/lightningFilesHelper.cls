/**
 * cretaed/written by Reid Efford - https://github.com/effordDev
 */
public with sharing class lightningFilesHelper {

    @AuraEnabled
    public static List<ContentVersion> getFiles( String recordId ){
        // get links
        List<ContentDocumentLink> links = [
            SELECT ContentDocumentId 
            FROM ContentDocumentLink 
            WHERE LinkedEntityId =: recordId
        ];

        // get doc ids
        Set<Id> docIds = new Set<Id>();
        for(ContentDocumentLink link : links){
            docIds.add( link.ContentDocumentId );
        }

        // get versions
        List<ContentVersion> versions = [
            SELECT Id, Title, PathOnClient, ContentDocumentId, ContentUrl,
                FileExtension, FileType, ContentSize, OwnerId, ContentModifiedDate
            FROM ContentVersion 
            WHERE ContentDocumentId IN :docIds
        ];//VersionData

        return versions;
    } 

    @AuraEnabled
    public static Boolean isCommunity(){
        
        String userId = UserInfo.getUserId();

        return [
            SELECT Id, IsPortalEnabled
            FROM User
            WHERE Id =: userId
        ].IsPortalEnabled;
    }
}
