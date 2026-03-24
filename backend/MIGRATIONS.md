# Database Migrations with Alembic

This project uses **Alembic** for database schema migrations instead of recreating the database on startup. This ensures data integrity and proper version control of schema changes.

## Setup

Alembic is already configured and installed via `requirements.txt`.

### Installation

```bash
cd backend
pip install -r requirements.txt
```

## Running Migrations

### Apply All Pending Migrations

```bash
alembic upgrade head
```

### Create a New Migration

After modifying models in `app/models.py`, create a migration:

```bash
alembic revision --autogenerate -m "Description of changes"
```

This generates a migration file in `alembic/versions/` that can be reviewed before applying.

### Review Migration

Check the generated migration file in `alembic/versions/` to ensure it's correct:

```python
def upgrade() -> None:
    # SQL operations to apply

def downgrade() -> None:
    # SQL operations to revert
```

### Apply Migration

```bash
alembic upgrade head
```

### Rollback Last Migration

```bash
alembic downgrade -1
```

## Key Files

- **`alembic.ini`** - Alembic configuration file
- **`alembic/env.py`** - Environment setup for migrations
- **`alembic/versions/`** - Directory containing all migration files
- **`alembic/script.py.mako`** - Template for generating migrations

## Current Migrations

- **001_add_question_table** - Creates the `question` table with fields:
  - `id` - Primary key
  - `user_id` - Foreign key to `user` table
  - `question` - Question text (max 10000 chars)
  - `answer` - AI-generated answer (max 50000 chars)
  - `created_at` - Timestamp of question
  - `updated_at` - Timestamp of last update

## Best Practices

1. **Always review generated migrations** before applying
2. **Don't edit migration files manually** - regenerate with `--autogenerate`
3. **Keep migrations in version control** - they are tracked in git
4. **Test migrations locally first** before deploying to production
5. **Never skip migrations** - apply them in order

## Troubleshooting

### "Can't locate Revision identified by '{id}'"

Ensure you're in the `backend` directory when running Alembic commands.

### Migration conflicts

If you have conflicting migrations, check the `down_revision` field to ensure the chain is correct.

## Workflow Example

1. **Modify a model:**

```python
# app/models.py
class Question(SQLModel, table=True):
    # ... existing fields ...
    tags: str = Field(default="")  # New field
```

2. **Create migration:**

```bash
cd backend
alembic revision --autogenerate -m "Add tags field to Question table"
```

3. **Review migration file:**

```bash
cat alembic/versions/002_add_tags_field_to_question_table.py
```

4. **Apply migration:**

```bash
alembic upgrade head
```

5. **Commit to git:**

```bash
git add -A
git commit -m "Add Question.tags field with migration"
git push
```

For more information, see [Alembic Documentation](https://alembic.sqlalchemy.org/)
