import os
import sys

# Ensure backend folder is in sys.path so config and routes can be imported cleanly
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import app
