public with sharing class insertContacts {
    @AuraEnabled
    public static String insertCont(List<Map<String, Object>> contactList, Id accountId) {
        List<Contact> contactsToInsert = new List<Contact>();

        for (Map<String, Object> row : contactList) {
            Contact con = new Contact();

		if (row.containsKey('LastName')) {
           con.LastName = String.valueOf(row.get('LastName'));
		}

		con.accountId = accountId;

            contactsToInsert.add(con);
        }

        if (!contactsToInsert.isEmpty()) {
            insert contactsToInsert;
            return 'Contacts inserted successfully: ' + contactsToInsert.size();
        } else {
            return 'No valid rows found to insert.';
        }
    }
}
