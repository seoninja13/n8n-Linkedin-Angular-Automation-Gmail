import json
from collections import Counter

# Load the JSON file
with open('.augment/Sample Outputs/apify-actor-input-returns-200.json', 'r') as f:
    contacts = json.load(f)

# Count total contacts
total_contacts = len(contacts)

# Count contacts per domain
domain_counts = Counter(contact['company_domain'] for contact in contacts)

# Print results
print(f"Total contacts: {total_contacts}")
print(f"Unique domains: {len(domain_counts)}")
print("\nContacts per domain:")
for domain, count in sorted(domain_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"  {domain}: {count}")

