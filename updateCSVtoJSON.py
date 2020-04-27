import xlrd
from collections import OrderedDict
import simplejson as json
# Open the workbook and select the first worksheet
wb = xlrd.open_workbook('./taula_maria.xlsx')

# USERNAMES TABLE --------------------------------------------------------------
sh = wb.sheet_by_index(0)
# List to hold dictionaries
data_list = []
# Iterate through each row in worksheet and fetch values into dict

for rownum in range(1, sh.nrows):
    data = OrderedDict()
    row_values = sh.row_values(rownum)
    data['name'] = str(row_values[0])
    data['password'] = str(row_values[1])
    data_list.append(data)
# Serialize the list of dicts to JSON
j = json.dumps(data_list)
# Write to file
with open('jsons_DB/usernamesDB.json', 'w') as f:
    f.write(j)

# CROSSWORD TABLE --------------------------------------------------------------
sh = wb.sheet_by_index(2)
# List to hold dictionaries
data_list = []
# Iterate through each row in worksheet and fetch values into dict

for rownum in range(1, sh.nrows):
    data = OrderedDict()
    row_values = sh.row_values(rownum)

    data['unit'] = int(row_values[0])
    data['word'] = str(row_values[1])
    data['description'] = str(row_values[2])
    data['crossword_position'] = int(row_values[3])
    data_list.append(data)
# Serialize the list of dicts to JSON
j = json.dumps(data_list)
# Write to file
with open('jsons_DB/crosswordDB.json', 'w') as f:
    f.write(j)

# SEARCH PUZZLE TABLE ----------------------------------------------------------
sh = wb.sheet_by_index(1)
# List to hold dictionaries
data_list = []
# Iterate through each row in worksheet and fetch values into dict

for rownum in range(1, sh.nrows):
    data = OrderedDict()
    row_values = sh.row_values(rownum)

    data['unit'] = int(row_values[0])
    data['word'] = str(row_values[1])
    data_list.append(data)
# Serialize the list of dicts to JSON
j = json.dumps(data_list)
# Write to file
with open('jsons_DB/searchpuzzleDB.json', 'w') as f:
    f.write(j)


# IMAGES TABLE -----------------------------------------------------------------
sh = wb.sheet_by_index(4)
# List to hold dictionaries
data_list = []
# Iterate through each row in worksheet and fetch values into dict

for rownum in range(1, sh.nrows):
    data = OrderedDict()
    row_values = sh.row_values(rownum)

    data['unit'] = int(row_values[0])
    data['word'] = str(row_values[1])
    data['URL'] = str(row_values[2])
    data_list.append(data)
# Serialize the list of dicts to JSON
j = json.dumps(data_list)
# Write to file
with open('jsons_DB/imagesDB.json', 'w') as f:
    f.write(j)


# TEXT LINE TABLE --------------------------------------------------------------
sh = wb.sheet_by_index(8)
# List to hold dictionaries
data_list = []
# Iterate through each row in worksheet and fetch values into dict

for rownum in range(1, sh.nrows):
    data = OrderedDict()
    row_values = sh.row_values(rownum)

    data['unit'] = int(row_values[0])
    data['word'] = str(row_values[1])
    data['URL'] = str(row_values[2])
    data_list.append(data)
# Serialize the list of dicts to JSON
j = json.dumps(data_list)
# Write to file
with open('jsons_DB/textlineDB.json', 'w') as f:
    f.write(j)

# HANGMAN TABLE -----------------------------------------------------------------
sh = wb.sheet_by_index(9)
# List to hold dictionaries
data_list = []
# Iterate through each row in worksheet and fetch values into dict

for rownum in range(1, sh.nrows):
    data = OrderedDict()
    row_values = sh.row_values(rownum)

    data['unit'] = int(row_values[0])
    data['word'] = str(row_values[1])
    data_list.append(data)
# Serialize the list of dicts to JSON
j = json.dumps(data_list)
# Write to file
with open('jsons_DB/hangmanDB.json', 'w') as f:
    f.write(j)


# MULTIPLE CHOICE TABLE --------------------------------------------------------
sh = wb.sheet_by_index(5)
# List to hold dictionaries
data_list = []
# Iterate through each row in worksheet and fetch values into dict

for rownum in range(1, sh.nrows):
    data = OrderedDict()
    row_values = sh.row_values(rownum)

    data['unit'] = int(row_values[0])
    data['number_word'] = int(row_values[1])
    data['number_correct'] = int(row_values[2])
    data['option1'] = str(row_values[3])
    data['option2'] = str(row_values[4])
    data['option3'] = str(row_values[5])
    data['option4'] = str(row_values[6])
    data_list.append(data)
# Serialize the list of dicts to JSON
j = json.dumps(data_list)
# Write to file
with open('jsons_DB/multiplechoiceDB.json', 'w') as f:
    f.write(j)


# MULTIPLE CHOICE TEXT TABLE ---------------------------------------------------
sh = wb.sheet_by_index(6)
# List to hold dictionaries
data_list = []
# Iterate through each row in worksheet and fetch values into dict

for rownum in range(1, sh.nrows):
    data = OrderedDict()
    row_values = sh.row_values(rownum)

    data['unit'] = int(row_values[0])
    data['text'] = str(row_values[1])
    data_list.append(data)
# Serialize the list of dicts to JSON
j = json.dumps(data_list)
# Write to file
with open('jsons_DB/multiplechoicetextDB.json', 'w') as f:
    f.write(j)


# GROUPING TABLE ---------------------------------------------------------------
sh = wb.sheet_by_index(7)
# List to hold dictionaries
data_list = []
# Iterate through each row in worksheet and fetch values into dict

for rownum in range(1, sh.nrows):
    data = OrderedDict()
    row_values = sh.row_values(rownum)

    data['unit'] = int(row_values[0])
    data['word'] = str(row_values[1])
    data['theme'] = str(row_values[2])
    data_list.append(data)
# Serialize the list of dicts to JSON
j = json.dumps(data_list)
# Write to file
with open('jsons_DB/groupingDB.json', 'w') as f:
    f.write(j)


# SOUNDS TABLE -----------------------------------------------------------------
sh = wb.sheet_by_index(3)
# List to hold dictionaries
data_list = []
# Iterate through each row in worksheet and fetch values into dict

for rownum in range(1, sh.nrows):
    data = OrderedDict()
    row_values = sh.row_values(rownum)

    data['unit'] = int(row_values[0])
    data['word'] = str(row_values[1])
    data['phrase'] = str(row_values[2])
    data['directory'] = str(row_values[3])
    data_list.append(data)

# Serialize the list of dicts to JSON
j = json.dumps(data_list)
# Write to file
with open('jsons_DB/soundsDB.json', 'w') as f:
    f.write(j)











print('Done')
