import sqlite3

# Connect to the database (or create it if it doesn't exist)
conn = sqlite3.connect('./Yogaws-main/instances/YWS.db')
cursor = conn.cursor()

# # Create the users table
# cursor.execute('''
# CREATE TABLE IF NOT EXISTS users (
#     UID INTEGER PRIMARY KEY AUTOINCREMENT,
#     name TEXT,
#     lastname TEXT,
#     Ph_no TEXT,
#     gender TEXT,
#     password TEXT
# );
# ''')

# # Create the instructors table
# cursor.execute('''
# CREATE TABLE IF NOT EXISTS instructors (
#     TID INTEGER PRIMARY KEY AUTOINCREMENT,
#     name TEXT,
#     lastname TEXT,
#     Ph_no TEXT,
#     DOB TEXT,
#     Address TEXT,
#     reference TEXT,
#     password TEXT, 
# );
# ''')

# cursor.execute('''
# CREATE TABLE IF NOT EXISTS instructor_learning (
    # ID INTEGER PRIMARY KEY AUTOINCREMENT,
    # TID INTEGER,
    # Course_name TEXT,
    # FOREIGN KEY (TID) REFERENCES instructors(TID)
# );
# ''')

# cursor.execute('''
# CREATE TABLE IF NOT EXISTS instructor_teaching (
    # ID INTEGER PRIMARY KEY AUTOINCREMENT,
    # TID INTEGER,
    # CID INTEGER,
    # FOREIGN KEY (TID) REFERENCES instructors(TID),
    # FOREIGN KEY (CID) REFERENCES course(CID)
# );
# ''')

# # Create the course table
# cursor.execute('''
# CREATE TABLE IF NOT EXISTS course (
#     CID INTEGER PRIMARY KEY AUTOINCREMENT,
#     Course_name TEXT,
#     Price REAL,
#     to_date TEXT,
#     from_date TEXT
# );
# ''')

# # Create the applicants table
# cursor.execute('''
# CREATE TABLE IF NOT EXISTS applicants (
#     APPID INTEGER PRIMARY KEY AUTOINCREMENT,
#     UID INTEGER,
#     CID INTEGER,
#     TID INTEGER,
#     FOREIGN KEY (UID) REFERENCES users(UID),
#     FOREIGN KEY (TID) REFERENCES instructors(TID),
#     FOREIGN KEY (CID) REFERENCES course(CID),
#     UNIQUE(UID, CID, TID)
# );
# ''')

# Create the workshop_sign_in table
cursor.execute('''
CREATE TABLE IF NOT EXISTS workshop_sign_in (
    WID INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    Ph_no TEXT,
    Comments TEXT
);
''')

# Commit the transaction
conn.commit()

# Close the cursor and connection
cursor.close()
conn.close()
