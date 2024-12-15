from flask import Flask, render_template, request, redirect, url_for, flash, g, session, jsonify
import sqlite3
import razorpay
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta

app = Flask(__name__)
application=app
app.secret_key = 'indramalayoga'  # For flashing messages
app.permanent_session_lifetime = timedelta(minutes=30)  # Set session timeout to 30 minutes
client = razorpay.Client(auth=("rzp_test_EJa6zI3VKH91qU", "aBL7GC5PGWoHSTQJuyu6bfGa"))

@app.before_request
def make_session_permanent():
    session.permanent = True

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect('./instances/YWS.db')
    return g.db

@app.teardown_appcontext
def close_db(exception):    
    db = g.pop('db', None)
    if db is not None:
        db.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/workshop', methods=['GET', 'POST'])
def workshop():
    if request.method == 'POST':
        # Retrieve form data
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        ph_no = request.form['ph_no']
        comments = request.form.get('comments', '')

        # Insert data into the database
        db=get_db()
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO workshop_sign_in (first_name, last_name, Ph_no, Comments)
            VALUES (?, ?, ?, ?)
        ''', (first_name, last_name, ph_no, comments))
        db.commit()
        db.close()

        # Provide feedback to the user
        flash('Registration successful!', 'success')
        return redirect('/workshop')

    return render_template('workshop.html')

@app.route('/knowmore')
def knowmore():
    return render_template('information.html')

@app.route('/enroll')
def enroll():
    if 'instructor_id' in session:  # Check if instructor_id is in session
        return render_template('teachercart.html')  # Render teacher-specific cart
    elif 'user_id' in session:  # Check if user_id is in session
        return render_template('addtocart.html')  # Render student-specific cart
    else:
        return redirect(url_for('login'))  # Redirect to login if no session exists


@app.route('/create_order', methods=['POST'])
def create_order():
    # Retrieve customer details from the session
    user_name = session.get('user_name', '')
    user_lastname = session.get('user_lastname', '')
    user_phone = session.get('user_phone', '')
    full_username = f"{user_name} {user_lastname}".strip()

    data = request.json
    amount = data.get('amount')  # Amount in paisa
    courses = data.get('courses', [])  # Retrieve courses from the request

    if amount and courses:
        try:
            # Create an order
            order_data = {
                "amount": amount,  # Amount in paisa
                "currency": "INR",
                "receipt": "order_rcptid_11",
                "notes": {  # Custom notes (optional) for the Razorpay dashboard
                    "customer_name": full_username,
                    "customer_phone": user_phone,
                },
            }
            order = client.order.create(data=order_data)

            # Store order details in session
            session['order_id'] = order['id']
            session['courses'] = courses
            session['amount'] = amount

            # Return a JSON response with the order ID
            return jsonify({"success": True, "order_id": order['id']})
        except Exception as e:
            return jsonify({"success": False, "error": str(e)})
    return jsonify({"success": False, "error": "Invalid amount or courses"})

@app.route('/pay')
def pay():
    # Retrieve order details from the session
    order_id = session.get('order_id')
    courses = session.get('courses', [])
    amount = session.get('amount')
    user_name = session.get('user_name', '')
    user_lastname = session.get('user_lastname', '')
    user_phone = session.get('user_phone', '')
    full_username = f"{user_name} {user_lastname}".strip()

    # Pass the order details to the template
    return render_template('pay.html', order_id=order_id, courses=courses, amount=amount, full_username=full_username, user_phone=user_phone)

@app.route('/teachercart')
def teachercart():
    return render_template('teachercart.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        first_name = request.form['firstName']
        last_name = request.form['secondName']
        phone_no = request.form['phoneNo']
        gender = request.form['Gender']
        password = request.form['password']

        db = get_db()
        cursor = db.cursor()

        # Check if the phone number already exists
        cursor.execute('SELECT Ph_no FROM users WHERE Ph_no = ?', (phone_no,))
        existing_user = cursor.fetchone()

        if existing_user:
            flash("Phone number already registered. Please use a different phone number.", "error")
            return redirect(url_for('success'))  # Redirect back to the registration page

        # If phone number doesn't exist, insert the new user
        cursor.execute('''
            INSERT INTO users (name, lastname, Ph_no, gender, password)
            VALUES (?, ?, ?, ?, ?)
        ''', (first_name, last_name, phone_no, gender, password))
        db.commit()

        flash("Registration successful!", "success")
        return redirect(url_for('index'))

    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        phone = request.form['phoneNo']
        password = request.form['password']

        # Special admin login
        if phone == '9999999999' and password == 'yogaws':
            session['user_type'] = 'admin'
            return redirect(url_for('admin'))

        # Connect to the database
        db = get_db()
        cursor = db.cursor()

        # Check users table
        cursor.execute('SELECT * FROM users WHERE Ph_no = ?', (phone,))
        user = cursor.fetchone()

        if user and (user[5], password):  
            session['user_type'] = 'user'
            session['user_id'] = user[0] 
            session['user_name'] = user[1]
            session['user_lastname'] = user[2]
            session['user_phone'] = user[3]
            return redirect(url_for('success'))

        # Check instructors table
        cursor.execute('SELECT * FROM instructors WHERE Ph_no = ?', (phone,))
        instructor = cursor.fetchone()

        if instructor:
            stored_password = instructor[7]  
            if (stored_password, password):
                # If user is found in 'instructors' table
                session['user_type'] = 'instructor'
                session['instructor_id'] = instructor[0]
                session['user_name'] = instructor[1]
                session['user_lastname'] = instructor[2]
                session['user_phone'] = instructor[3]  
                return redirect(url_for('instructor_dashboard'))

        # If no matching user is found
        flash("Invalid phone number or password", "danger")
        return redirect(url_for('login'))

    return render_template('login.html')



@app.route('/apply', methods=['GET', 'POST'])
def apply():
    if request.method == 'POST':    
        first_name = request.form['fname']
        last_name = request.form['lname']
        dob_day = request.form['dob-date']
        dob_month = request.form['dob-month']
        dob_year = request.form['dob-year']
        address = request.form['address']
        address2 = request.form['address2']
        city = request.form['city']
        state = request.form['state']
        postal = request.form['postal']
        phone = request.form['phone']
        hear = request.form['hear']
        password = request.form['password']  

        # Format the date of birth
        dob = f"{dob_year}-{dob_month}-{dob_day}"

        # Connect to the database
        db = get_db()
        cursor = db.cursor()

        # Check if the phone number already exists
        cursor.execute('SELECT * FROM instructors WHERE Ph_no = ?', (phone,))
        existing_instructor = cursor.fetchone()

        if existing_instructor:
            flash("Phone number already registered. Please use a different number.", "error")
            return redirect(url_for('apply'))  # Redirect back to the application form

        # Insert data into the instructors table
        cursor.execute('''
            INSERT INTO instructors (name, lastname, Ph_no, DOB, Address, reference, password)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (first_name, last_name, phone, dob, f"{address}, {address2}, {city}, {state}, {postal}", hear, generate_password_hash(password)))
        
        # Get the TID of the newly inserted instructor
        # new_instructor_id = cursor.lastrowid

        # # Insert the position value into the instructor_learning table
        # cursor.execute('''
        #     INSERT INTO instructor_learning (TID, Course_name)
        #     VALUES (?, ?)
        # ''', (new_instructor_id))

        # Commit the changes
        db.commit()
        
        flash("Application submitted successfully!", "success")
        return render_template('teachercart.html')  # Render teachercart.html after success

    return render_template('appl.html')

@app.route('/instructor_dashboard')
def instructor_dashboard():
    # Check if the user is logged in as an instructor
    if 'instructor_id' not in session:
        flash("You need to be logged in as an instructor to access this page.", "warning")
        return redirect(url_for('login'))

    conn = get_db()
    cursor = conn.cursor()

    # Fetch the instructor's name and assigned courses (teaching)
    cursor.execute('''
        SELECT i.name, i.lastname, c.Course_name
        FROM instructors i
        JOIN instructor_teaching it ON i.TID = it.TID
        JOIN course c ON it.CID = c.CID
        WHERE i.TID = ?
    ''', (session['instructor_id'],))
    instructor_courses = cursor.fetchall()

    if instructor_courses:
        instructor_name = f"{instructor_courses[0][0]} {instructor_courses[0][1]}"  # Assuming name at index 0 and lastname at index 1
    else:
        instructor_name = ''

    # Fetch students grouped by course (for teaching courses)
    cursor.execute('''
        SELECT u.name, u.lastname, c.Course_name
        FROM users u
        JOIN applicants a ON u.UID = a.UID
        JOIN course c ON a.CID = c.CID
        JOIN instructor_teaching it ON c.CID = it.CID
        WHERE it.TID = ?
    ''', (session['instructor_id'],))
    students_data = cursor.fetchall()

    # Group students by course
    students_by_course = {}
    for row in students_data:
        course_name = row[2]  # Assuming 'Course_name' is at index 2
        student_name = f"{row[0]} {row[1]}"  # Assuming 'name' at index 0 and 'lastname' at index 1

        if course_name not in students_by_course:
            students_by_course[course_name] = []
        students_by_course[course_name].append(student_name)

    # Fetch courses the instructor is learning
    cursor.execute('''
        SELECT Course_name
        FROM instructor_learning
        WHERE TID = ?
    ''', (session['instructor_id'],))
    learning_courses = [row[0] for row in cursor.fetchall()]  # Get the list of course names

    # Close connection
    conn.close()

    # Pass the data to the template
    return render_template('teach_dashboard.html', 
                           instructor_name=instructor_name, 
                           students_by_course=students_by_course,
                           learning_courses=learning_courses)



@app.route('/logout')
def logout():
    session.clear()
    flash("Logged out successfully.", "success")
    return redirect(url_for('index'))


@app.route('/success')
def success():
    if 'user_id' not in session:
        flash("You need to be logged in to access this page.", "warning")
        return redirect(url_for('login'))
    
    # Retrieve user_name and user_lastname from the session
    user_name = session.get('user_name')
    user_lastname = session.get('user_lastname')
    
    # Pass the variables to the template
    return render_template('index.html', user_name=user_name, user_lastname=user_lastname)

@app.route('/gallery')
def gallery():
    return render_template('gallery.html')

@app.route('/vision')
def vision():
    return render_template('visionNmission.html')

@app.route('/admin')
def admin():
    if 'user_type' not in session or session['user_type'] != 'admin':
        flash("You need to be logged in as an admin to access this page.", "warning")
        return redirect(url_for('login'))

    db = get_db()
    cursor = db.cursor()

    # Total enrollments (entries in applicants table)
    cursor.execute('SELECT COUNT(DISTINCT UID) FROM applicants')
    total_enrollments = cursor.fetchone()[0]

    # Total instructors (entries in instructors table)
    cursor.execute('SELECT COUNT(*) FROM instructors')
    total_instructors = cursor.fetchone()[0]

    # Total courses (entries in course table)
    cursor.execute('SELECT COUNT(*) FROM course')
    total_courses = cursor.fetchone()[0]

    # Total income (sum of Fees in applicants table)
    cursor.execute('SELECT SUM(course.Price) FROM course INNER JOIN applicants ON course.CID = applicants.CID;')
    total_income = cursor.fetchone()[0] or 0  # Default to 0 if there are no fees

    # New students (first 10 entries from applicants table, join with users to get names)
    cursor.execute('''
        SELECT DISTINCT u.name, u.lastname 
        FROM applicants a 
        JOIN users u ON a.UID = u.UID 
        LIMIT 10
    ''')
    new_students = cursor.fetchall()

    return render_template(
        'admin.html',
        total_enrollments=total_enrollments,
        total_instructors=total_instructors,
        total_courses=total_courses,
        total_income=total_income,
        new_students=new_students
)

#all about enrollment display and delete    
@app.route('/edit_enrollments')
def edit_enrollments():
    # Connect to the database
    db = get_db()
    cursor = db.cursor()

    # Query to get the user's name, lastname, course names, and fees paid
    cursor.execute('''
        SELECT users.UID, users.name, users.lastname, 
               GROUP_CONCAT(course.Course_name, ', ') AS Course_names,
               SUM(course.Price) AS Total_Fees, applicants.APPID
        FROM applicants 
        JOIN users ON applicants.UID = users.UID
        JOIN course ON applicants.CID = course.CID
        GROUP BY users.UID
    ''')
    enrollments = cursor.fetchall()

    # Close the connection
    cursor.close()

    # Render enrollments.html and pass the enrollments data
    return render_template('enrollments.html', enrollments=enrollments)



@app.route('/delete_enrollment/<int:appid>', methods=['POST'])
def delete_enrollment(appid):
    db = get_db()
    cursor = db.cursor()

    # First, fetch the UID of the user associated with the given APPID
    cursor.execute('SELECT UID FROM applicants WHERE APPID = ?', (appid,))
    user = cursor.fetchone()

    if user:
        uid = user[0]

        # Delete the enrollment from the applicants table
        cursor.execute('DELETE FROM applicants WHERE APPID = ?', (appid,))
        db.commit()

        # Now delete the user from the users table based on the UID
        cursor.execute('DELETE FROM users WHERE UID = ?', (uid,))
        db.commit()

        flash("Enrollment and user deleted successfully!", "success")
    else:
        flash("User not found or already deleted.", "error")

    return redirect(url_for('edit_enrollments'))


#all about editing instructors and deleting them
@app.route('/edit_instructors')
def edit_instructors():
    db = get_db()
    cursor = db.cursor()

    # Fetch all instructors and their assigned courses
    cursor.execute('''
        SELECT i.TID, i.name, i.lastname, i.Ph_no, i.Address, c.CID, c.Course_name, il.Course_name AS learning_course
        FROM instructors i
        LEFT JOIN instructor_teaching it ON i.TID = it.TID
        LEFT JOIN course c ON it.CID = c.CID
        LEFT JOIN instructor_learning il ON i.TID = il.TID
    ''')
    instructors_data = cursor.fetchall()

    # Structure the data for easy access in the template
    instructors = {}
    for row in instructors_data:
        tid = row[0]
        if tid not in instructors:
            instructors[tid] = {
                'tid': tid,
                'name': row[1],
                'lastname': row[2],
                'phone': row[3],
                'address': row[4],
                'courses': [],
                'learning_courses': []
            }
        if row[5]:
            instructors[tid]['courses'].append({'cid': row[5], 'name': row[6]})
        if row[7]:
            instructors[tid]['learning_courses'].append(row[7])

    instructors = list(instructors.values())

    # Fetch all courses for the dropdown
    cursor.execute('SELECT CID, Course_name FROM course')
    all_courses = cursor.fetchall()

    return render_template('instructors.html', instructors=instructors, all_courses=all_courses)


@app.route('/add_instructor_course/<int:tid>', methods=['POST'])
def add_instructor_course(tid):
    course_id = request.form['course']
    db = get_db()
    cursor = db.cursor()
    cursor.execute('INSERT INTO instructor_teaching (TID, CID) VALUES (?, ?)', (tid, course_id))
    db.commit()
    flash("Course added successfully!", "success")
    return redirect(url_for('edit_instructors'))

@app.route('/remove_instructor_course/<int:tid>/<int:cid>', methods=['POST'])
def remove_instructor_course(tid, cid):
    db = get_db()
    cursor = db.cursor()
    cursor.execute('DELETE FROM instructor_teaching WHERE TID = ? AND CID = ?', (tid, cid))
    db.commit()
    flash("Course removed successfully!", "success")
    return redirect(url_for('edit_instructors'))

@app.route('/delete_instructor_enrollment/<int:tid>', methods=['POST'])
def delete_instructor_enrollment(tid):
    db = get_db()
    cursor = db.cursor()

    # Delete instructor from instructors table
    cursor.execute('DELETE FROM instructors WHERE TID = ?', (tid,))
    db.commit()

    flash("Instructor and their data deleted successfully!", "success")
    return redirect(url_for('edit_instructors'))


#all about editing course
@app.route('/edit_course', methods=['GET', 'POST'])
def edit_course():
    db = get_db()
    cursor = db.cursor()

    if request.method == 'POST':
        # Check if the request is for adding a new course or updating an existing course
        if 'course_id' in request.form:
            # Update existing course's start and end dates
            course_id = request.form['course_id']
            from_date = request.form['from_date']
            to_date = request.form['to_date']

            cursor.execute('''
                UPDATE course
                SET from_date = ?, to_date = ?
                WHERE CID = ?
            ''', (from_date, to_date, course_id))
            db.commit()
            flash("Course dates updated successfully!", "success")

        else:
            # Insert new course
            course_name = request.form['course_name']
            price = request.form['price']
            from_date = request.form['from_date']
            to_date = request.form['to_date']

            cursor.execute('''
                INSERT INTO course (Course_name, Price, from_date, to_date)
                VALUES (?, ?, ?, ?)
            ''', (course_name, price, from_date, to_date))
            db.commit()
            flash("Course added successfully!", "success")

        return redirect(url_for('edit_course'))

    # Fetch all courses when the method is GET
    cursor.execute('SELECT CID, Course_name, Price, from_date, to_date FROM course')
    courses = cursor.fetchall()

    return render_template('course.html', courses=courses)

@app.route('/delete_course/<int:course_id>', methods=['POST'])
def delete_course(course_id):
    db = get_db()
    cursor = db.cursor()

    # Find and delete the course by course_id
    cursor.execute('DELETE FROM course WHERE CID = ?', (course_id,))
    db.commit()

    flash("Course deleted successfully!", "success")
    return redirect(url_for('edit_course'))


# @app.route('/view_all_students')
# def view_all_students():
#     # Connect to the database
#     conn = sqlite3.connect('./Yogaws-main/instances/YWS.db')
#     cursor = conn.cursor()

#     # Query to get the students' first name, last name, and course name from the applicants table
#     # changed by parthk
#     cursor.execute('''
#         SELECT users.name, users.lastname, applicants.Course_name
#         FROM applicants 
#         JOIN users ON applicants.UID = users.UID
#     ''')
#     students = cursor.fetchall()

#     # Close the connection
#     cursor.close()
#     conn.close()
#     print(students)  # Check if this prints a non-empty list
#     # Pass the data to the template
#     return render_template('view_all_students.html', students=students)

@app.route('/process_payment', methods=['POST'])
def process_payment():
    data = request.json
    username = data.get('username')
    courses = data.get('courses', [])

    db = get_db()
    cursor = db.cursor()

    # Find the user ID based on the username
    cursor.execute('SELECT UID FROM users WHERE name || " " || lastname = ?', (username,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"success": False, "error": "User not found"})

    user_id = user[0]

    # Insert each course into the applicants table
    for course_name in courses:
        cursor.execute('SELECT CID FROM course WHERE Course_name = ?', (course_name,))
        course = cursor.fetchone()

        if course:
            course_id = course[0]
            cursor.execute('INSERT INTO applicants (UID, CID) VALUES (?, ?)', (user_id, course_id))

    db.commit()
    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True)