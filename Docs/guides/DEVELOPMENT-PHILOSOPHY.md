# Core Development Philosophy

Fundamental principles for all code development in this repository.

## Design Principles

### KISS (Keep It Simple, Stupid)

**Definition**: Simplicity should be a key goal in design.

**Guidelines**:
- Choose straightforward solutions over complex ones whenever possible
- Simple solutions are easier to understand, maintain, and debug
- If you can't explain it simply, you don't understand it well enough

**Examples**:
```python
# ✅ KISS: Simple, clear
def is_valid_email(email):
    return '@' in email and '.' in email

# ❌ Complex: Over-engineered
def is_valid_email(email):
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email)) if email else False
```

**When to Apply**:
- Writing new functions
- Refactoring existing code
- Choosing between multiple approaches
- Designing system architecture

---

### YAGNI (You Aren't Gonna Need It)

**Definition**: Avoid building functionality on speculation.

**Guidelines**:
- Implement features only when they are needed, not when you anticipate they might be useful
- Don't add hooks, callbacks, or abstraction layers "just in case"
- Current requirements take priority over hypothetical future needs

**Examples**:
```python
# ✅ YAGNI: Implement what's needed now
def send_email(to, subject, body):
    gmail.send(to, subject, body)

# ❌ Over-engineered: Building for未来 scenarios
def send_message(to, subject, body, provider='gmail',
                 priority='normal', retry=3, callback=None,
                 attachments=None, cc=None, bcc=None):
    # Complex routing logic for features we don't need yet
    ...
```

**When to Apply**:
- Adding new features
- Extending existing code
- Designing APIs
- Planning architecture

---

## Core Architectural Principles

### Dependency Inversion

**Definition**: High-level modules should not depend on low-level modules. Both should depend on abstractions.

**Guidelines**:
- Depend on interfaces, not concrete implementations
- Inject dependencies rather than hard-coding them
- Make components testable and swappable

**Example**:
```python
# ✅ Dependency Inversion: Depends on abstraction
class EmailSender:
    def __init__(self, email_service):
        self.service = email_service  # Injected dependency

    def send(self, to, subject, body):
        return self.service.send(to, subject, body)

# ❌ Tight Coupling: Depends on concrete implementation
class EmailSender:
    def __init__(self):
        self.gmail = GmailAPI()  # Hard-coded dependency

    def send(self, to, subject, body):
        return self.gmail.send(to, subject, body)
```

---

### Open/Closed Principle

**Definition**: Software entities should be open for extension but closed for modification.

**Guidelines**:
- Add new functionality by extending, not by modifying existing code
- Use inheritance, composition, or plugins for new features
- Protect stable code from changes

**Example**:
```python
# ✅ Open/Closed: Extend via inheritance
class BaseProcessor:
    def process(self, data):
        raise NotImplementedError

class EmailProcessor(BaseProcessor):
    def process(self, data):
        # New functionality via extension
        return self.validate_email(data)

# ❌ Modification: Changing existing code for new features
class Processor:
    def process(self, data, type='default'):
        if type == 'email':
            # Added new code to existing function
            return self.validate_email(data)
        else:
            return data
```

---

### Single Responsibility

**Definition**: Each function, class, and module should have one clear purpose.

**Guidelines**:
- Functions do ONE thing
- Classes represent ONE concept
- Modules group related functionality

**Example**:
```python
# ✅ Single Responsibility: Each function has one job
def validate_email(email):
    return '@' in email

def send_email(to, subject, body):
    gmail.send(to, subject, body)

def log_email_sent(to):
    logger.info(f"Email sent to {to}")

# ❌ Multiple Responsibilities: Function does too much
def send_and_log_email(to, subject, body):
    # Validation
    if '@' not in to:
        raise ValueError("Invalid email")

    # Sending
    gmail.send(to, subject, body)

    # Logging
    logger.info(f"Email sent to {to}")

    # Tracking
    db.increment_email_count(to)
```

---

### Fail Fast

**Definition**: Check for potential errors early and raise exceptions immediately when issues occur.

**Guidelines**:
- Validate inputs at function entry
- Raise exceptions for invalid states
- Don't silently ignore errors
- Make failures obvious and loud

**Example**:
```python
# ✅ Fail Fast: Validate immediately
def send_email(to, subject, body):
    if not to:
        raise ValueError("Email recipient required")
    if '@' not in to:
        raise ValueError(f"Invalid email: {to}")

    return gmail.send(to, subject, body)

# ❌ Fail Slow: Errors hidden until later
def send_email(to, subject, body):
    try:
        if to:  # Silent skip if empty
            gmail.send(to, subject, body)
    except Exception:
        pass  # Silent failure
```

---

## Code Structure & Modularity

### File and Function Limits

**Files**: Never create a file longer than 500 lines of code.
- If approaching this limit, refactor by splitting into modules
- Group related functions into separate files
- Use clear, descriptive filenames

**Functions**: Keep functions under 50 lines with a single, clear responsibility.
- If function exceeds 50 lines, break into smaller functions
- Each function should do ONE thing
- Extract helper functions for complex logic

**Classes**: Limit classes to under 100 lines and represent a single concept or entity.
- If class exceeds 100 lines, consider splitting
- Use composition over inheritance
- Single Responsibility Principle applies

**Line Length**: Maximum 100 characters per line (enforced via ruff rule in pyproject.toml)
- Break long lines at logical points
- Use parentheses for line continuation
- Keep code readable on standard displays

---

### Organization

**Group by Feature**:
```
project/
├── email/
│   ├── sender.py
│   ├── validator.py
│   └── formatter.py
├── workflow/
│   ├── orchestrator.py
│   └── scheduler.py
```

**Not by Type**:
```
❌ project/
├── models/
├── views/
├── controllers/
```

**Benefits**:
- Related code stays together
- Easier to find and modify features
- Clear module boundaries

---

## Python-Specific Guidelines

### Virtual Environment

**Always use `venv_linux`** (the virtual environment) when executing Python commands, including for unit tests.

**Activation**:
```bash
source venv_linux/bin/activate
```

**Running Tests**:
```bash
# ✅ With venv
source venv_linux/bin/activate
python -m pytest tests/

# ❌ Without venv
python -m pytest tests/
```

---

### PEP 8 Style

**Follow PEP 8 style guidelines**:
- 4 spaces for indentation (no tabs)
- 2 blank lines between top-level functions/classes
- 1 blank line between methods
- Imports at top of file
- Module-level constants in UPPER_CASE

**Tools**:
- Use `ruff` for linting
- Use `black` for formatting
- Configure in `pyproject.toml`

---

### Type Hints

**Use type hints for function parameters and return values**.

**Example**:
```python
# ✅ With type hints
def send_email(to: str, subject: str, body: str) -> bool:
    gmail.send(to, subject, body)
    return True

# ❌ Without type hints
def send_email(to, subject, body):
    gmail.send(to, subject, body)
    return True
```

**Benefits**:
- Self-documenting code
- Better IDE autocomplete
- Catch type errors early
- Easier refactoring

---

## Quick Reference Checklist

**Before Writing Code**:
- [ ] Do I need this feature now? (YAGNI)
- [ ] What's the simplest solution? (KISS)
- [ ] Does this function have one purpose? (Single Responsibility)

**During Development**:
- [ ] Is this function under 50 lines?
- [ ] Is this file under 500 lines?
- [ ] Are dependencies injected? (Dependency Inversion)
- [ ] Am I validating inputs early? (Fail Fast)
- [ ] Do I have type hints?

**Code Review**:
- [ ] Can I explain this simply?
- [ ] Is this open for extension? (Open/Closed)
- [ ] Are errors handled explicitly?
- [ ] Is code organized by feature?
- [ ] Does it follow PEP 8?

---

## Related Documentation

- **N8N Best Practices**: [N8N-BEST-PRACTICES.md](N8N-BEST-PRACTICES.md)
- **Git Workflow**: [GIT-WORKFLOW.md](GIT-WORKFLOW.md)
- **Common Tasks**: [COMMON-TASKS.md](COMMON-TASKS.md)

## Last Updated

2025-11-24
