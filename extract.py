import docx, logging
from docx.document import Document
from docx.table import Table, _Cell, _Row
from docx.text.paragraph import Paragraph

d = docx.Document('_orig.docx')

def iter_block_items(parent):
    from docx.oxml.text.paragraph import CT_P
    from docx.oxml.table import CT_Tbl
    parent_elm = parent.element.body if isinstance(parent, Document) else parent._tc
    for child in parent_elm.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, parent)
        elif isinstance(child, CT_Tbl):
            yield Table(child, parent)

def dump(parent, label):
    for block in iter_block_items(parent):
        if isinstance(block, Paragraph):
            if block.text.strip():
                print(f"[{label} P] {block.text!r}")
        elif isinstance(block, Table):
            print(f"[{label} TABLE {len(block.rows)}x{len(block.columns)}]")
            for ri, row in enumerate(block.rows):
                for ci, cell in enumerate(row.cells):
                    dump(cell, f"{label} T{ri},{ci}")

dump(d, 'doc')
