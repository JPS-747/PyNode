"""Add connection fields to DatabaseSkill table

Revision ID: 002_add_databaseskill_connection_fields
Revises: 001_add_question_table
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "002_add_databaseskill_connection_fields"
down_revision = "001_add_question_table"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add connection fields to databaseskill table."""
    # Add new columns to databaseskill table
    op.add_column('databaseskill', sa.Column('host', sa.String(), nullable=True))
    op.add_column('databaseskill', sa.Column('port', sa.Integer(), nullable=True))
    op.add_column('databaseskill', sa.Column('user', sa.String(), nullable=True))
    op.add_column('databaseskill', sa.Column('password', sa.String(), nullable=True))
    op.add_column('databaseskill', sa.Column('database', sa.String(), nullable=True))


def downgrade() -> None:
    """Remove connection fields from databaseskill table."""
    op.drop_column('databaseskill', 'database')
    op.drop_column('databaseskill', 'password')
    op.drop_column('databaseskill', 'user')
    op.drop_column('databaseskill', 'port')
    op.drop_column('databaseskill', 'host')
