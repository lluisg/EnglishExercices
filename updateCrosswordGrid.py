import xlrd
from collections import OrderedDict
import simplejson as json
# Open the workbook and select the first worksheet
wb = xlrd.open_workbook('./taula_grids_crossword.xlsx')
NUM_UNITS = 6
# List to hold dictionaries
data_list = []

for i in range(NUM_UNITS):
    # CROSSWORD GRID TABLE ---------------------------------------------------------
    sh = wb.sheet_by_index(i)
    # Iterate through each row in worksheet and fetch values into dict
    data = OrderedDict()

    matrix = []
    data['unit'] = i+1
    for rownum in range(1, sh.nrows):
        row = []
        row_values = sh.row_values(rownum)

        for colnum, elem in enumerate(row_values):
            if colnum > 0:
                if elem == '':
                    row.append(0)
                else:
                    row.append(elem.split('a')[1])
        matrix.append(row)
    data['grid'] = matrix
    data_list.append(data)


# Serialize the list of dicts to JSON
j = json.dumps(data_list)
# Write to file
with open('jsons_DB/crosswordgridDB.json', 'w') as f:
    f.write(j)



print('Done!')
