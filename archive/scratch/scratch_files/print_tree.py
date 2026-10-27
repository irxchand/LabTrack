import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def generate_tree(dir_path, prefix=''):
    try:
        entries = sorted(os.listdir(dir_path))
    except PermissionError:
        return
        
    ignore_dirs = {'.git', 'node_modules', '.venv', '.pytest_cache', '.local', '__pycache__', 'dist', '.artifacts', 'labtrack.egg-info'}
    entries = [e for e in entries if e not in ignore_dirs and not e.endswith('.pyc')]
    
    total = len(entries)
    for i, entry in enumerate(entries):
        p = os.path.join(dir_path, entry)
        is_last = (i == total - 1)
        connector = '└── ' if is_last else '├── '
        sub_prefix = '    ' if is_last else '│   '
        if os.path.isdir(p):
            print(f'{prefix}{connector}{entry}/')
            generate_tree(p, prefix + sub_prefix)
        else:
            size_kb = os.path.getsize(p) / 1024
            print(f'{prefix}{connector}{entry} ({size_kb:.1f} KB)')

if __name__ == '__main__':
    print('LabTrack/ (d:\\Users\\Documents\\Symbiosis\\Academics\\Sem 3\\Low Credit\\CCE\\Project)')
    generate_tree('.')
