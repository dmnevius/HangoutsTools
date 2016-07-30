// This file contains helper functions that are automatically created from
// templates.

#include "nuitka/prelude.hpp"

extern PyObject *callPythonFunction( PyObject *func, PyObject **args, int count );


PyObject *CALL_FUNCTION_WITH_ARGS1( PyObject *called, PyObject **args )
{
    CHECK_OBJECT( called );

    // Check if arguments are valid objects in debug mode.
#ifndef __NUITKA_NO_ASSERT__
    for( size_t i = 0; i < 1; i++ )
    {
        CHECK_OBJECT( args[ i ] );
    }
#endif

    if ( Nuitka_Function_Check( called ) )
    {
        if (unlikely( Py_EnterRecursiveCall( (char *)" while calling a Python object" ) ))
        {
            return NULL;
        }

        Nuitka_FunctionObject *function = (Nuitka_FunctionObject *)called;
        PyObject *result;

        if ( function->m_args_simple && 1 == function->m_args_positional_count )
        {
            for( Py_ssize_t i = 0; i < 1; i++ )
            {
                Py_INCREF( args[ i ] );
            }

            result = function->m_c_code( function, args );
        }
        else if ( function->m_args_simple && 1 + function->m_defaults_given == function->m_args_positional_count )
        {
#ifdef _MSC_VER
            PyObject **python_pars = (PyObject **)_alloca( sizeof( PyObject * ) * function->m_args_positional_count );
#else
            PyObject *python_pars[ function->m_args_positional_count ];
#endif
            memcpy( python_pars, args, 1 * sizeof(PyObject *) );
            memcpy( python_pars + 1, &PyTuple_GET_ITEM( function->m_defaults, 0 ), function->m_defaults_given * sizeof(PyObject *) );

            for( Py_ssize_t i = 0; i < function->m_args_positional_count; i++ )
            {
                Py_INCREF( python_pars[ i ] );
            }

            result = function->m_c_code( function, python_pars );
        }
        else
        {
#ifdef _MSC_VER
            PyObject **python_pars = (PyObject **)_alloca( sizeof( PyObject * ) * function->m_args_overall_count );
#else
            PyObject *python_pars[ function->m_args_overall_count ];
#endif
            memset( python_pars, 0, function->m_args_overall_count * sizeof(PyObject *) );

            if ( parseArgumentsPos( function, python_pars, args, 1 ))
            {
                result = function->m_c_code( function, python_pars );
            }
            else
            {
                result = NULL;
            }
        }

        Py_LeaveRecursiveCall();

        return result;
    }
    else if ( Nuitka_Method_Check( called ) )
    {
        Nuitka_MethodObject *method = (Nuitka_MethodObject *)called;

        // Unbound method without arguments, let the error path be slow.
        if ( method->m_object != NULL )
        {
            if (unlikely( Py_EnterRecursiveCall( (char *)" while calling a Python object" ) ))
            {
                return NULL;
            }

            Nuitka_FunctionObject *function = method->m_function;

            PyObject *result;

            if ( function->m_args_simple && 1 + 1 == function->m_args_positional_count )
            {
#ifdef _MSC_VER
                PyObject **python_pars = (PyObject **)_alloca( sizeof( PyObject * ) * function->m_args_positional_count );
#else
                PyObject *python_pars[ function->m_args_positional_count ];
#endif
                python_pars[ 0 ] = method->m_object;
                Py_INCREF( method->m_object );

                for( Py_ssize_t i = 0; i < 1; i++ )
                {
                    python_pars[ i + 1 ] = args[ i ];
                    Py_INCREF( args[ i ] );
                }

                result = function->m_c_code( function, python_pars );
            }
            else if ( function->m_args_simple && 1 + 1 + function->m_defaults_given == function->m_args_positional_count )
            {
#ifdef _MSC_VER
                PyObject **python_pars = (PyObject **)_alloca( sizeof( PyObject * ) * function->m_args_positional_count );
#else
                PyObject *python_pars[ function->m_args_positional_count ];
#endif
                python_pars[ 0 ] = method->m_object;
                Py_INCREF( method->m_object );

                memcpy( python_pars+1, args, 1 * sizeof(PyObject *) );
                memcpy( python_pars+1 + 1, &PyTuple_GET_ITEM( function->m_defaults, 0 ), function->m_defaults_given * sizeof(PyObject *) );

                for( Py_ssize_t i = 1; i < function->m_args_overall_count; i++ )
                {
                    Py_INCREF( python_pars[ i ] );
                }

                result = function->m_c_code( function, python_pars );
            }
            else
            {
#ifdef _MSC_VER
                PyObject **python_pars = (PyObject **)_alloca( sizeof( PyObject * ) * function->m_args_overall_count );
#else
                PyObject *python_pars[ function->m_args_overall_count ];
#endif
                memset( python_pars, 0, function->m_args_overall_count * sizeof(PyObject *) );

                if ( parseArgumentsMethodPos( function, python_pars, method->m_object, args, 1 ) )
                {
                    result = function->m_c_code( function, python_pars );
                }
                else
                {
                    result = NULL;
                }
            }

            Py_LeaveRecursiveCall();

            return result;
        }
    }
    else if ( PyCFunction_Check( called ) )
    {
        // Try to be fast about wrapping the arguments.
        int flags = PyCFunction_GET_FLAGS( called );

        if ( flags & METH_NOARGS )
        {
#if 1 == 0
            PyCFunction method = PyCFunction_GET_FUNCTION( called );
            PyObject *self = PyCFunction_GET_SELF( called );

            // Recursion guard is not strictly necessary, as we already have
            // one on our way to here.
#ifdef _NUITKA_FULL_COMPAT
            if (unlikely( Py_EnterRecursiveCall( (char *)" while calling a Python object" ) ))
            {
                return NULL;
            }
#endif

            PyObject *result = (*method)( self, NULL );

#ifdef _NUITKA_FULL_COMPAT
            Py_LeaveRecursiveCall();
#endif

            if ( result != NULL )
            {
            // Some buggy C functions do set an error, but do not indicate it
            // and Nuitka inner workings can get upset/confused from it.
                DROP_ERROR_OCCURRED();

                return result;
            }
            else
            {
                // Other buggy C functions do this, return NULL, but with
                // no error set, not allowed.
                if (unlikely( !ERROR_OCCURRED() ))
                {
                    PyErr_Format(
                        PyExc_SystemError,
                        "NULL result without error in PyObject_Call"
                    );
                }

                return NULL;
            }
#else
            PyErr_Format(
                PyExc_TypeError,
                "%s() takes no arguments (1 given)",
                ((PyCFunctionObject *)called)->m_ml->ml_name
            );
            return NULL;
#endif
        }
        else if ( flags & METH_O )
        {
#if 1 == 1
            PyCFunction method = PyCFunction_GET_FUNCTION( called );
            PyObject *self = PyCFunction_GET_SELF( called );

            // Recursion guard is not strictly necessary, as we already have
            // one on our way to here.
#ifdef _NUITKA_FULL_COMPAT
            if (unlikely( Py_EnterRecursiveCall( (char *)" while calling a Python object" ) ))
            {
                return NULL;
            }
#endif

            PyObject *result = (*method)( self, args[0] );

#ifdef _NUITKA_FULL_COMPAT
            Py_LeaveRecursiveCall();
#endif

            if ( result != NULL )
            {
            // Some buggy C functions do set an error, but do not indicate it
            // and Nuitka inner workings can get upset/confused from it.
                DROP_ERROR_OCCURRED();

                return result;
            }
            else
            {
                // Other buggy C functions do this, return NULL, but with
                // no error set, not allowed.
                if (unlikely( !ERROR_OCCURRED() ))
                {
                    PyErr_Format(
                        PyExc_SystemError,
                        "NULL result without error in PyObject_Call"
                    );
                }

                return NULL;
            }
#else
            PyErr_Format(PyExc_TypeError,
                "%s() takes exactly one argument (1 given)",
                 ((PyCFunctionObject *)called)->m_ml->ml_name
            );
            return NULL;
#endif
        }
        else
        {
            PyCFunction method = PyCFunction_GET_FUNCTION( called );
            PyObject *self = PyCFunction_GET_SELF( called );

            PyObject *pos_args = MAKE_TUPLE( args, 1 );

            PyObject *result;

            assert( flags && METH_VARARGS );

            // Recursion guard is not strictly necessary, as we already have
            // one on our way to here.
#ifdef _NUITKA_FULL_COMPAT
            if (unlikely( Py_EnterRecursiveCall( (char *)" while calling a Python object" ) ))
            {
                return NULL;
            }
#endif

            if ( flags && METH_KEYWORDS )
            {
                result = (*(PyCFunctionWithKeywords)method)( self, pos_args, NULL );
            }
            else
            {
                result = (*method)( self, pos_args );
            }

#ifdef _NUITKA_FULL_COMPAT
            Py_LeaveRecursiveCall();
#endif

            if ( result != NULL )
            {
            // Some buggy C functions do set an error, but do not indicate it
            // and Nuitka inner workings can get upset/confused from it.
                DROP_ERROR_OCCURRED();

                Py_DECREF( pos_args );
                return result;
            }
            else
            {
                // Other buggy C functions do this, return NULL, but with
                // no error set, not allowed.
                if (unlikely( !ERROR_OCCURRED() ))
                {
                    PyErr_Format(
                        PyExc_SystemError,
                        "NULL result without error in PyObject_Call"
                    );
                }

                Py_DECREF( pos_args );
                return NULL;
            }
        }
    }
    else if ( PyFunction_Check( called ) )
    {
        return callPythonFunction(
            called,
            args,
            1
        );
    }

    PyObject *pos_args = MAKE_TUPLE( args, 1 );

    PyObject *result = CALL_FUNCTION(
        called,
        pos_args,
        NULL
    );

    Py_DECREF( pos_args );

    return result;
}

PyObject *CALL_FUNCTION_WITH_ARGS2( PyObject *called, PyObject **args )
{
    CHECK_OBJECT( called );

    // Check if arguments are valid objects in debug mode.
#ifndef __NUITKA_NO_ASSERT__
    for( size_t i = 0; i < 2; i++ )
    {
        CHECK_OBJECT( args[ i ] );
    }
#endif

    if ( Nuitka_Function_Check( called ) )
    {
        if (unlikely( Py_EnterRecursiveCall( (char *)" while calling a Python object" ) ))
        {
            return NULL;
        }

        Nuitka_FunctionObject *function = (Nuitka_FunctionObject *)called;
        PyObject *result;

        if ( function->m_args_simple && 2 == function->m_args_positional_count )
        {
            for( Py_ssize_t i = 0; i < 2; i++ )
            {
                Py_INCREF( args[ i ] );
            }

            result = function->m_c_code( function, args );
        }
        else if ( function->m_args_simple && 2 + function->m_defaults_given == function->m_args_positional_count )
        {
#ifdef _MSC_VER
            PyObject **python_pars = (PyObject **)_alloca( sizeof( PyObject * ) * function->m_args_positional_count );
#else
            PyObject *python_pars[ function->m_args_positional_count ];
#endif
            memcpy( python_pars, args, 2 * sizeof(PyObject *) );
            memcpy( python_pars + 2, &PyTuple_GET_ITEM( function->m_defaults, 0 ), function->m_defaults_given * sizeof(PyObject *) );

            for( Py_ssize_t i = 0; i < function->m_args_positional_count; i++ )
            {
                Py_INCREF( python_pars[ i ] );
            }

            result = function->m_c_code( function, python_pars );
        }
        else
        {
#ifdef _MSC_VER
            PyObject **python_pars = (PyObject **)_alloca( sizeof( PyObject * ) * function->m_args_overall_count );
#else
            PyObject *python_pars[ function->m_args_overall_count ];
#endif
            memset( python_pars, 0, function->m_args_overall_count * sizeof(PyObject *) );

            if ( parseArgumentsPos( function, python_pars, args, 2 ))
            {
                result = function->m_c_code( function, python_pars );
            }
            else
            {
                result = NULL;
            }
        }

        Py_LeaveRecursiveCall();

        return result;
    }
    else if ( Nuitka_Method_Check( called ) )
    {
        Nuitka_MethodObject *method = (Nuitka_MethodObject *)called;

        // Unbound method without arguments, let the error path be slow.
        if ( method->m_object != NULL )
        {
            if (unlikely( Py_EnterRecursiveCall( (char *)" while calling a Python object" ) ))
            {
                return NULL;
            }

            Nuitka_FunctionObject *function = method->m_function;

            PyObject *result;

            if ( function->m_args_simple && 2 + 1 == function->m_args_positional_count )
            {
#ifdef _MSC_VER
                PyObject **python_pars = (PyObject **)_alloca( sizeof( PyObject * ) * function->m_args_positional_count );
#else
                PyObject *python_pars[ function->m_args_positional_count ];
#endif
                python_pars[ 0 ] = method->m_object;
                Py_INCREF( method->m_object );

                for( Py_ssize_t i = 0; i < 2; i++ )
                {
                    python_pars[ i + 1 ] = args[ i ];
                    Py_INCREF( args[ i ] );
                }

                result = function->m_c_code( function, python_pars );
            }
            else if ( function->m_args_simple && 2 + 1 + function->m_defaults_given == function->m_args_positional_count )
            {
#ifdef _MSC_VER
                PyObject **python_pars = (PyObject **)_alloca( sizeof( PyObject * ) * function->m_args_positional_count );
#else
                PyObject *python_pars[ function->m_args_positional_count ];
#endif
                python_pars[ 0 ] = method->m_object;
                Py_INCREF( method->m_object );

                memcpy( python_pars+1, args, 2 * sizeof(PyObject *) );
                memcpy( python_pars+1 + 2, &PyTuple_GET_ITEM( function->m_defaults, 0 ), function->m_defaults_given * sizeof(PyObject *) );

                for( Py_ssize_t i = 1; i < function->m_args_overall_count; i++ )
                {
                    Py_INCREF( python_pars[ i ] );
                }

                result = function->m_c_code( function, python_pars );
            }
            else
            {
#ifdef _MSC_VER
                PyObject **python_pars = (PyObject **)_alloca( sizeof( PyObject * ) * function->m_args_overall_count );
#else
                PyObject *python_pars[ function->m_args_overall_count ];
#endif
                memset( python_pars, 0, function->m_args_overall_count * sizeof(PyObject *) );

                if ( parseArgumentsMethodPos( function, python_pars, method->m_object, args, 2 ) )
                {
                    result = function->m_c_code( function, python_pars );
                }
                else
                {
                    result = NULL;
                }
            }

            Py_LeaveRecursiveCall();

            return result;
        }
    }
    else if ( PyCFunction_Check( called ) )
    {
        // Try to be fast about wrapping the arguments.
        int flags = PyCFunction_GET_FLAGS( called );

        if ( flags & METH_NOARGS )
        {
#if 2 == 0
            PyCFunction method = PyCFunction_GET_FUNCTION( called );
            PyObject *self = PyCFunction_GET_SELF( called );

            // Recursion guard is not strictly necessary, as we already have
            // one on our way to here.
#ifdef _NUITKA_FULL_COMPAT
            if (unlikely( Py_EnterRecursiveCall( (char *)" while calling a Python object" ) ))
            {
                return NULL;
            }
#endif

            PyObject *result = (*method)( self, NULL );

#ifdef _NUITKA_FULL_COMPAT
            Py_LeaveRecursiveCall();
#endif

            if ( result != NULL )
            {
            // Some buggy C functions do set an error, but do not indicate it
            // and Nuitka inner workings can get upset/confused from it.
                DROP_ERROR_OCCURRED();

                return result;
            }
            else
            {
                // Other buggy C functions do this, return NULL, but with
                // no error set, not allowed.
                if (unlikely( !ERROR_OCCURRED() ))
                {
                    PyErr_Format(
                        PyExc_SystemError,
                        "NULL result without error in PyObject_Call"
                    );
                }

                return NULL;
            }
#else
            PyErr_Format(
                PyExc_TypeError,
                "%s() takes no arguments (2 given)",
                ((PyCFunctionObject *)called)->m_ml->ml_name
            );
            return NULL;
#endif
        }
        else if ( flags & METH_O )
        {
#if 2 == 1
            PyCFunction method = PyCFunction_GET_FUNCTION( called );
            PyObject *self = PyCFunction_GET_SELF( called );

            // Recursion guard is not strictly necessary, as we already have
            // one on our way to here.
#ifdef _NUITKA_FULL_COMPAT
            if (unlikely( Py_EnterRecursiveCall( (char *)" while calling a Python object" ) ))
            {
                return NULL;
            }
#endif

            PyObject *result = (*method)( self, args[0] );

#ifdef _NUITKA_FULL_COMPAT
            Py_LeaveRecursiveCall();
#endif

            if ( result != NULL )
            {
            // Some buggy C functions do set an error, but do not indicate it
            // and Nuitka inner workings can get upset/confused from it.
                DROP_ERROR_OCCURRED();

                return result;
            }
            else
            {
                // Other buggy C functions do this, return NULL, but with
                // no error set, not allowed.
                if (unlikely( !ERROR_OCCURRED() ))
                {
                    PyErr_Format(
                        PyExc_SystemError,
                        "NULL result without error in PyObject_Call"
                    );
                }

                return NULL;
            }
#else
            PyErr_Format(PyExc_TypeError,
                "%s() takes exactly one argument (2 given)",
                 ((PyCFunctionObject *)called)->m_ml->ml_name
            );
            return NULL;
#endif
        }
        else
        {
            PyCFunction method = PyCFunction_GET_FUNCTION( called );
            PyObject *self = PyCFunction_GET_SELF( called );

            PyObject *pos_args = MAKE_TUPLE( args, 2 );

            PyObject *result;

            assert( flags && METH_VARARGS );

            // Recursion guard is not strictly necessary, as we already have
            // one on our way to here.
#ifdef _NUITKA_FULL_COMPAT
            if (unlikely( Py_EnterRecursiveCall( (char *)" while calling a Python object" ) ))
            {
                return NULL;
            }
#endif

            if ( flags && METH_KEYWORDS )
            {
                result = (*(PyCFunctionWithKeywords)method)( self, pos_args, NULL );
            }
            else
            {
                result = (*method)( self, pos_args );
            }

#ifdef _NUITKA_FULL_COMPAT
            Py_LeaveRecursiveCall();
#endif

            if ( result != NULL )
            {
            // Some buggy C functions do set an error, but do not indicate it
            // and Nuitka inner workings can get upset/confused from it.
                DROP_ERROR_OCCURRED();

                Py_DECREF( pos_args );
                return result;
            }
            else
            {
                // Other buggy C functions do this, return NULL, but with
                // no error set, not allowed.
                if (unlikely( !ERROR_OCCURRED() ))
                {
                    PyErr_Format(
                        PyExc_SystemError,
                        "NULL result without error in PyObject_Call"
                    );
                }

                Py_DECREF( pos_args );
                return NULL;
            }
        }
    }
    else if ( PyFunction_Check( called ) )
    {
        return callPythonFunction(
            called,
            args,
            2
        );
    }

    PyObject *pos_args = MAKE_TUPLE( args, 2 );

    PyObject *result = CALL_FUNCTION(
        called,
        pos_args,
        NULL
    );

    Py_DECREF( pos_args );

    return result;
}

PyObject *CALL_FUNCTION_WITH_ARGS3( PyObject *called, PyObject **args )
{
    CHECK_OBJECT( called );

    // Check if arguments are valid objects in debug mode.
#ifndef __NUITKA_NO_ASSERT__
    for( size_t i = 0; i < 3; i++ )
    {
        CHECK_OBJECT( args[ i ] );
    }
#endif

    if ( Nuitka_Function_Check( called ) )
    {
        if (unlikely( Py_EnterRecursiveCall( (char *)" while calling a Python object" ) ))
        {
            return NULL;
        }

        Nuitka_FunctionObject *function = (Nuitka_FunctionObject *)called;
        PyObject *result;

        if ( function->m_args_simple && 3 == function->m_args_positional_count )
        {
            for( Py_ssize_t i = 0; i < 3; i++ )
            {
                Py_INCREF( args[ i ] );
            }

            result = function->m_c_code( function, args );
        }
        else if ( function->m_args_simple && 3 + function->m_defaults_given == function->m_args_positional_count )
        {
#ifdef _MSC_VER
            PyObject **python_pars = (PyObject **)_alloca( sizeof( PyObject * ) * function->m_args_positional_count );
#else
            PyObject *python_pars[ function->m_args_positional_count ];
#endif
            memcpy( python_pars, args, 3 * sizeof(PyObject *) );
            memcpy( python_pars + 3, &PyTuple_GET_ITEM( function->m_defaults, 0 ), function->m_defaults_given * sizeof(PyObject *) );

            for( Py_ssize_t i = 0; i < function->m_args_positional_count; i++ )
            {
                Py_INCREF( python_pars[ i ] );
            }

            result = function->m_c_code( function, python_pars );
        }
        else
        {
#ifdef _MSC_VER
            PyObject **python_pars = (PyObject **)_alloca( sizeof( PyObject * ) * function->m_args_overall_count );
#else
            PyObject *python_pars[ function->m_args_overall_count ];
#endif
            memset( python_pars, 0, function->m_args_overall_count * sizeof(PyObject *) );

            if ( parseArgumentsPos( function, python_pars, args, 3 ))
            {
                result = function->m_c_code( function, python_pars );
            }
            else
            {
                result = NULL;
            }
        }

        Py_LeaveRecursiveCall();

        return result;
    }
    else if ( Nuitka_Method_Check( called ) )
    {
        Nuitka_MethodObject *method = (Nuitka_MethodObject *)called;

        // Unbound method without arguments, let the error path be slow.
        if ( method->m_object != NULL )
        {
            if (unlikely( Py_EnterRecursiveCall( (char *)" while calling a Python object" ) ))
            {
                return NULL;
            }

            Nuitka_FunctionObject *function = method->m_function;

            PyObject *result;

            if ( function->m_args_simple && 3 + 1 == function->m_args_positional_count )
            {
#ifdef _MSC_VER
                PyObject **python_pars = (PyObject **)_alloca( sizeof( PyObject * ) * function->m_args_positional_count );
#else
                PyObject *python_pars[ function->m_args_positional_count ];
#endif
                python_pars[ 0 ] = method->m_object;
                Py_INCREF( method->m_object );

                for( Py_ssize_t i = 0; i < 3; i++ )
                {
                    python_pars[ i + 1 ] = args[ i ];
                    Py_INCREF( args[ i ] );
                }

                result = function->m_c_code( function, python_pars );
            }
            else if ( function->m_args_simple && 3 + 1 + function->m_defaults_given == function->m_args_positional_count )
            {
#ifdef _MSC_VER
                PyObject **python_pars = (PyObject **)_alloca( sizeof( PyObject * ) * function->m_args_positional_count );
#else
                PyObject *python_pars[ function->m_args_positional_count ];
#endif
                python_pars[ 0 ] = method->m_object;
                Py_INCREF( method->m_object );

                memcpy( python_pars+1, args, 3 * sizeof(PyObject *) );
                memcpy( python_pars+1 + 3, &PyTuple_GET_ITEM( function->m_defaults, 0 ), function->m_defaults_given * sizeof(PyObject *) );

                for( Py_ssize_t i = 1; i < function->m_args_overall_count; i++ )
                {
                    Py_INCREF( python_pars[ i ] );
                }

                result = function->m_c_code( function, python_pars );
            }
            else
            {
#ifdef _MSC_VER
                PyObject **python_pars = (PyObject **)_alloca( sizeof( PyObject * ) * function->m_args_overall_count );
#else
                PyObject *python_pars[ function->m_args_overall_count ];
#endif
                memset( python_pars, 0, function->m_args_overall_count * sizeof(PyObject *) );

                if ( parseArgumentsMethodPos( function, python_pars, method->m_object, args, 3 ) )
                {
                    result = function->m_c_code( function, python_pars );
                }
                else
                {
                    result = NULL;
                }
            }

            Py_LeaveRecursiveCall();

            return result;
        }
    }
    else if ( PyCFunction_Check( called ) )
    {
        // Try to be fast about wrapping the arguments.
        int flags = PyCFunction_GET_FLAGS( called );

        if ( flags & METH_NOARGS )
        {
#if 3 == 0
            PyCFunction method = PyCFunction_GET_FUNCTION( called );
            PyObject *self = PyCFunction_GET_SELF( called );

            // Recursion guard is not strictly necessary, as we already have
            // one on our way to here.
#ifdef _NUITKA_FULL_COMPAT
            if (unlikely( Py_EnterRecursiveCall( (char *)" while calling a Python object" ) ))
            {
                return NULL;
            }
#endif

            PyObject *result = (*method)( self, NULL );

#ifdef _NUITKA_FULL_COMPAT
            Py_LeaveRecursiveCall();
#endif

            if ( result != NULL )
            {
            // Some buggy C functions do set an error, but do not indicate it
            // and Nuitka inner workings can get upset/confused from it.
                DROP_ERROR_OCCURRED();

                return result;
            }
            else
            {
                // Other buggy C functions do this, return NULL, but with
                // no error set, not allowed.
                if (unlikely( !ERROR_OCCURRED() ))
                {
                    PyErr_Format(
                        PyExc_SystemError,
                        "NULL result without error in PyObject_Call"
                    );
                }

                return NULL;
            }
#else
            PyErr_Format(
                PyExc_TypeError,
                "%s() takes no arguments (3 given)",
                ((PyCFunctionObject *)called)->m_ml->ml_name
            );
            return NULL;
#endif
        }
        else if ( flags & METH_O )
        {
#if 3 == 1
            PyCFunction method = PyCFunction_GET_FUNCTION( called );
            PyObject *self = PyCFunction_GET_SELF( called );

            // Recursion guard is not strictly necessary, as we already have
            // one on our way to here.
#ifdef _NUITKA_FULL_COMPAT
            if (unlikely( Py_EnterRecursiveCall( (char *)" while calling a Python object" ) ))
            {
                return NULL;
            }
#endif

            PyObject *result = (*method)( self, args[0] );

#ifdef _NUITKA_FULL_COMPAT
            Py_LeaveRecursiveCall();
#endif

            if ( result != NULL )
            {
            // Some buggy C functions do set an error, but do not indicate it
            // and Nuitka inner workings can get upset/confused from it.
                DROP_ERROR_OCCURRED();

                return result;
            }
            else
            {
                // Other buggy C functions do this, return NULL, but with
                // no error set, not allowed.
                if (unlikely( !ERROR_OCCURRED() ))
                {
                    PyErr_Format(
                        PyExc_SystemError,
                        "NULL result without error in PyObject_Call"
                    );
                }

                return NULL;
            }
#else
            PyErr_Format(PyExc_TypeError,
                "%s() takes exactly one argument (3 given)",
                 ((PyCFunctionObject *)called)->m_ml->ml_name
            );
            return NULL;
#endif
        }
        else
        {
            PyCFunction method = PyCFunction_GET_FUNCTION( called );
            PyObject *self = PyCFunction_GET_SELF( called );

            PyObject *pos_args = MAKE_TUPLE( args, 3 );

            PyObject *result;

            assert( flags && METH_VARARGS );

            // Recursion guard is not strictly necessary, as we already have
            // one on our way to here.
#ifdef _NUITKA_FULL_COMPAT
            if (unlikely( Py_EnterRecursiveCall( (char *)" while calling a Python object" ) ))
            {
                return NULL;
            }
#endif

            if ( flags && METH_KEYWORDS )
            {
                result = (*(PyCFunctionWithKeywords)method)( self, pos_args, NULL );
            }
            else
            {
                result = (*method)( self, pos_args );
            }

#ifdef _NUITKA_FULL_COMPAT
            Py_LeaveRecursiveCall();
#endif

            if ( result != NULL )
            {
            // Some buggy C functions do set an error, but do not indicate it
            // and Nuitka inner workings can get upset/confused from it.
                DROP_ERROR_OCCURRED();

                Py_DECREF( pos_args );
                return result;
            }
            else
            {
                // Other buggy C functions do this, return NULL, but with
                // no error set, not allowed.
                if (unlikely( !ERROR_OCCURRED() ))
                {
                    PyErr_Format(
                        PyExc_SystemError,
                        "NULL result without error in PyObject_Call"
                    );
                }

                Py_DECREF( pos_args );
                return NULL;
            }
        }
    }
    else if ( PyFunction_Check( called ) )
    {
        return callPythonFunction(
            called,
            args,
            3
        );
    }

    PyObject *pos_args = MAKE_TUPLE( args, 3 );

    PyObject *result = CALL_FUNCTION(
        called,
        pos_args,
        NULL
    );

    Py_DECREF( pos_args );

    return result;
}
/* Code to register embedded modules for meta path based loading if any. */

#include "nuitka/unfreezing.hpp"

/* Table for lookup to find compiled or bytecode modules included in this
 * binary or module, or put along this binary as extension modules. We do
 * our own loading for each of these.
 */
MOD_INIT_DECL( __main__ );
static struct Nuitka_MetaPathBasedLoaderEntry meta_path_loader_entries[] =
{
    { (char *)"__main__", MOD_INIT_NAME( __main__ ), NULL, 0, NUITKA_COMPILED_MODULE },
    { (char *)"_bsddb", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_codecs_cn", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_codecs_hk", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_codecs_iso2022", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_codecs_jp", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_codecs_kr", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_codecs_tw", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_csv", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_ctypes", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_curses", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_curses_panel", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_elementtree", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_hashlib", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_hotshot", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_json", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_lsprof", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_multibytecodec", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_multiprocessing", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_sqlite3", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"_ssl", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"bz2", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"dbm", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"mmap", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"parser", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"pyexpat", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"readline", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"resource", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"termios", NULL, NULL, 0, NUITKA_SHLIB_FLAG },
    { (char *)"BaseHTTPServer", NULL, &constant_bin[ 343 ], 21682, NUITKA_BYTECODE_FLAG },
    { (char *)"Bastion", NULL, &constant_bin[ 22025 ], 6622, NUITKA_BYTECODE_FLAG },
    { (char *)"CGIHTTPServer", NULL, &constant_bin[ 28647 ], 10984, NUITKA_BYTECODE_FLAG },
    { (char *)"Canvas", NULL, &constant_bin[ 39631 ], 15396, NUITKA_BYTECODE_FLAG },
    { (char *)"ConfigParser", NULL, &constant_bin[ 55027 ], 25087, NUITKA_BYTECODE_FLAG },
    { (char *)"Cookie", NULL, &constant_bin[ 80114 ], 22574, NUITKA_BYTECODE_FLAG },
    { (char *)"Dialog", NULL, &constant_bin[ 102688 ], 1902, NUITKA_BYTECODE_FLAG },
    { (char *)"DocXMLRPCServer", NULL, &constant_bin[ 104590 ], 9791, NUITKA_BYTECODE_FLAG },
    { (char *)"FileDialog", NULL, &constant_bin[ 114381 ], 9672, NUITKA_BYTECODE_FLAG },
    { (char *)"FixTk", NULL, &constant_bin[ 124053 ], 2078, NUITKA_BYTECODE_FLAG },
    { (char *)"HTMLParser", NULL, &constant_bin[ 126131 ], 13662, NUITKA_BYTECODE_FLAG },
    { (char *)"MimeWriter", NULL, &constant_bin[ 139793 ], 7338, NUITKA_BYTECODE_FLAG },
    { (char *)"Queue", NULL, &constant_bin[ 147131 ], 9360, NUITKA_BYTECODE_FLAG },
    { (char *)"ScrolledText", NULL, &constant_bin[ 156491 ], 2646, NUITKA_BYTECODE_FLAG },
    { (char *)"SimpleDialog", NULL, &constant_bin[ 159137 ], 4309, NUITKA_BYTECODE_FLAG },
    { (char *)"SimpleHTTPServer", NULL, &constant_bin[ 163446 ], 7980, NUITKA_BYTECODE_FLAG },
    { (char *)"SimpleXMLRPCServer", NULL, &constant_bin[ 171426 ], 22782, NUITKA_BYTECODE_FLAG },
    { (char *)"SocketServer", NULL, &constant_bin[ 194208 ], 23948, NUITKA_BYTECODE_FLAG },
    { (char *)"StringIO", NULL, &constant_bin[ 218156 ], 11434, NUITKA_BYTECODE_FLAG },
    { (char *)"Tix", NULL, &constant_bin[ 229590 ], 95379, NUITKA_BYTECODE_FLAG },
    { (char *)"Tkconstants", NULL, &constant_bin[ 324969 ], 2236, NUITKA_BYTECODE_FLAG },
    { (char *)"Tkdnd", NULL, &constant_bin[ 327205 ], 12765, NUITKA_BYTECODE_FLAG },
    { (char *)"Tkinter", NULL, &constant_bin[ 339970 ], 199053, NUITKA_BYTECODE_FLAG },
    { (char *)"UserDict", NULL, &constant_bin[ 539023 ], 9613, NUITKA_BYTECODE_FLAG },
    { (char *)"UserList", NULL, &constant_bin[ 548636 ], 6501, NUITKA_BYTECODE_FLAG },
    { (char *)"UserString", NULL, &constant_bin[ 555137 ], 14720, NUITKA_BYTECODE_FLAG },
    { (char *)"_LWPCookieJar", NULL, &constant_bin[ 569857 ], 5513, NUITKA_BYTECODE_FLAG },
    { (char *)"_MozillaCookieJar", NULL, &constant_bin[ 575370 ], 4445, NUITKA_BYTECODE_FLAG },
    { (char *)"__future__", NULL, &constant_bin[ 579815 ], 4272, NUITKA_BYTECODE_FLAG },
    { (char *)"_abcoll", NULL, &constant_bin[ 584087 ], 25466, NUITKA_BYTECODE_FLAG },
    { (char *)"_osx_support", NULL, &constant_bin[ 609553 ], 11752, NUITKA_BYTECODE_FLAG },
    { (char *)"_pyio", NULL, &constant_bin[ 621305 ], 64318, NUITKA_BYTECODE_FLAG },
    { (char *)"_strptime", NULL, &constant_bin[ 685623 ], 15121, NUITKA_BYTECODE_FLAG },
    { (char *)"_sysconfigdata", NULL, &constant_bin[ 700744 ], 271, NUITKA_BYTECODE_FLAG },
    { (char *)"_sysconfigdata_nd", NULL, &constant_bin[ 701015 ], 20800, NUITKA_BYTECODE_FLAG },
    { (char *)"_threading_local", NULL, &constant_bin[ 721815 ], 6578, NUITKA_BYTECODE_FLAG },
    { (char *)"_weakrefset", NULL, &constant_bin[ 728393 ], 9574, NUITKA_BYTECODE_FLAG },
    { (char *)"abc", NULL, &constant_bin[ 737967 ], 6113, NUITKA_BYTECODE_FLAG },
    { (char *)"aifc", NULL, &constant_bin[ 744080 ], 30327, NUITKA_BYTECODE_FLAG },
    { (char *)"anydbm", NULL, &constant_bin[ 774407 ], 2786, NUITKA_BYTECODE_FLAG },
    { (char *)"argparse", NULL, &constant_bin[ 777193 ], 64033, NUITKA_BYTECODE_FLAG },
    { (char *)"ast", NULL, &constant_bin[ 841226 ], 12898, NUITKA_BYTECODE_FLAG },
    { (char *)"asynchat", NULL, &constant_bin[ 854124 ], 8751, NUITKA_BYTECODE_FLAG },
    { (char *)"asyncore", NULL, &constant_bin[ 862875 ], 18714, NUITKA_BYTECODE_FLAG },
    { (char *)"atexit", NULL, &constant_bin[ 881589 ], 2183, NUITKA_BYTECODE_FLAG },
    { (char *)"audiodev", NULL, &constant_bin[ 883772 ], 8407, NUITKA_BYTECODE_FLAG },
    { (char *)"bdb", NULL, &constant_bin[ 892179 ], 18971, NUITKA_BYTECODE_FLAG },
    { (char *)"binhex", NULL, &constant_bin[ 911150 ], 15349, NUITKA_BYTECODE_FLAG },
    { (char *)"bisect", NULL, &constant_bin[ 926499 ], 3053, NUITKA_BYTECODE_FLAG },
    { (char *)"bsddb", NULL, &constant_bin[ 929552 ], 12368, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"bsddb.db", NULL, &constant_bin[ 941920 ], 582, NUITKA_BYTECODE_FLAG },
    { (char *)"bsddb.dbobj", NULL, &constant_bin[ 942502 ], 18601, NUITKA_BYTECODE_FLAG },
    { (char *)"bsddb.dbrecio", NULL, &constant_bin[ 961103 ], 5269, NUITKA_BYTECODE_FLAG },
    { (char *)"bsddb.dbshelve", NULL, &constant_bin[ 966372 ], 12910, NUITKA_BYTECODE_FLAG },
    { (char *)"bsddb.dbtables", NULL, &constant_bin[ 979282 ], 24402, NUITKA_BYTECODE_FLAG },
    { (char *)"bsddb.dbutils", NULL, &constant_bin[ 1003684 ], 1615, NUITKA_BYTECODE_FLAG },
    { (char *)"cProfile", NULL, &constant_bin[ 1005299 ], 6272, NUITKA_BYTECODE_FLAG },
    { (char *)"calendar", NULL, &constant_bin[ 1011571 ], 27624, NUITKA_BYTECODE_FLAG },
    { (char *)"cgi", NULL, &constant_bin[ 1039195 ], 32417, NUITKA_BYTECODE_FLAG },
    { (char *)"cgitb", NULL, &constant_bin[ 1071612 ], 12140, NUITKA_BYTECODE_FLAG },
    { (char *)"chunk", NULL, &constant_bin[ 1083752 ], 5571, NUITKA_BYTECODE_FLAG },
    { (char *)"cmd", NULL, &constant_bin[ 1089323 ], 13989, NUITKA_BYTECODE_FLAG },
    { (char *)"code", NULL, &constant_bin[ 1103312 ], 10294, NUITKA_BYTECODE_FLAG },
    { (char *)"codeop", NULL, &constant_bin[ 1113606 ], 6569, NUITKA_BYTECODE_FLAG },
    { (char *)"collections", NULL, &constant_bin[ 1120175 ], 26051, NUITKA_BYTECODE_FLAG },
    { (char *)"colorsys", NULL, &constant_bin[ 1146226 ], 3967, NUITKA_BYTECODE_FLAG },
    { (char *)"commands", NULL, &constant_bin[ 1150193 ], 2449, NUITKA_BYTECODE_FLAG },
    { (char *)"compileall", NULL, &constant_bin[ 1152642 ], 6997, NUITKA_BYTECODE_FLAG },
    { (char *)"compiler", NULL, &constant_bin[ 1159639 ], 1287, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"compiler.ast", NULL, &constant_bin[ 1160926 ], 71339, NUITKA_BYTECODE_FLAG },
    { (char *)"compiler.consts", NULL, &constant_bin[ 1232265 ], 727, NUITKA_BYTECODE_FLAG },
    { (char *)"compiler.future", NULL, &constant_bin[ 1232992 ], 3018, NUITKA_BYTECODE_FLAG },
    { (char *)"compiler.misc", NULL, &constant_bin[ 1236010 ], 3687, NUITKA_BYTECODE_FLAG },
    { (char *)"compiler.pyassem", NULL, &constant_bin[ 1239697 ], 25831, NUITKA_BYTECODE_FLAG },
    { (char *)"compiler.pycodegen", NULL, &constant_bin[ 1265528 ], 56161, NUITKA_BYTECODE_FLAG },
    { (char *)"compiler.symbols", NULL, &constant_bin[ 1321689 ], 17557, NUITKA_BYTECODE_FLAG },
    { (char *)"compiler.syntax", NULL, &constant_bin[ 1339246 ], 1862, NUITKA_BYTECODE_FLAG },
    { (char *)"compiler.transformer", NULL, &constant_bin[ 1341108 ], 47372, NUITKA_BYTECODE_FLAG },
    { (char *)"compiler.visitor", NULL, &constant_bin[ 1388480 ], 4159, NUITKA_BYTECODE_FLAG },
    { (char *)"contextlib", NULL, &constant_bin[ 1392639 ], 4422, NUITKA_BYTECODE_FLAG },
    { (char *)"cookielib", NULL, &constant_bin[ 1397061 ], 54567, NUITKA_BYTECODE_FLAG },
    { (char *)"copy", NULL, &constant_bin[ 1451628 ], 12140, NUITKA_BYTECODE_FLAG },
    { (char *)"csv", NULL, &constant_bin[ 1463768 ], 13454, NUITKA_BYTECODE_FLAG },
    { (char *)"ctypes", NULL, &constant_bin[ 1477222 ], 20192, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"ctypes._endian", NULL, &constant_bin[ 1497414 ], 2287, NUITKA_BYTECODE_FLAG },
    { (char *)"ctypes.util", NULL, &constant_bin[ 1499701 ], 7868, NUITKA_BYTECODE_FLAG },
    { (char *)"curses", NULL, &constant_bin[ 1507569 ], 1539, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"curses.ascii", NULL, &constant_bin[ 1509108 ], 5040, NUITKA_BYTECODE_FLAG },
    { (char *)"curses.has_key", NULL, &constant_bin[ 1514148 ], 5925, NUITKA_BYTECODE_FLAG },
    { (char *)"curses.panel", NULL, &constant_bin[ 1520073 ], 267, NUITKA_BYTECODE_FLAG },
    { (char *)"curses.textpad", NULL, &constant_bin[ 1520340 ], 6842, NUITKA_BYTECODE_FLAG },
    { (char *)"curses.wrapper", NULL, &constant_bin[ 1527182 ], 1206, NUITKA_BYTECODE_FLAG },
    { (char *)"dbhash", NULL, &constant_bin[ 1528388 ], 706, NUITKA_BYTECODE_FLAG },
    { (char *)"decimal", NULL, &constant_bin[ 1529094 ], 170849, NUITKA_BYTECODE_FLAG },
    { (char *)"difflib", NULL, &constant_bin[ 1699943 ], 61833, NUITKA_BYTECODE_FLAG },
    { (char *)"dircache", NULL, &constant_bin[ 1761776 ], 1560, NUITKA_BYTECODE_FLAG },
    { (char *)"dis", NULL, &constant_bin[ 1763336 ], 6204, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils", NULL, &constant_bin[ 1769540 ], 405, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"distutils.archive_util", NULL, &constant_bin[ 1769945 ], 7432, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.bcppcompiler", NULL, &constant_bin[ 1777377 ], 7856, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.ccompiler", NULL, &constant_bin[ 1785233 ], 36748, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.cmd", NULL, &constant_bin[ 1821981 ], 16722, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command", NULL, &constant_bin[ 1838703 ], 655, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"distutils.command.bdist", NULL, &constant_bin[ 1839358 ], 5199, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.bdist_dumb", NULL, &constant_bin[ 1844557 ], 5025, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.bdist_msi", NULL, &constant_bin[ 1849582 ], 23971, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.bdist_rpm", NULL, &constant_bin[ 1873553 ], 17724, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.bdist_wininst", NULL, &constant_bin[ 1891277 ], 10950, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.build", NULL, &constant_bin[ 1902227 ], 5125, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.build_clib", NULL, &constant_bin[ 1907352 ], 6405, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.build_ext", NULL, &constant_bin[ 1913757 ], 19417, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.build_py", NULL, &constant_bin[ 1933174 ], 11483, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.build_scripts", NULL, &constant_bin[ 1944657 ], 4512, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.check", NULL, &constant_bin[ 1949169 ], 6236, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.clean", NULL, &constant_bin[ 1955405 ], 3158, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.config", NULL, &constant_bin[ 1958563 ], 12642, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.install", NULL, &constant_bin[ 1971205 ], 17971, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.install_data", NULL, &constant_bin[ 1989176 ], 3142, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.install_egg_info", NULL, &constant_bin[ 1992318 ], 4421, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.install_headers", NULL, &constant_bin[ 1996739 ], 2274, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.install_lib", NULL, &constant_bin[ 1999013 ], 6752, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.install_scripts", NULL, &constant_bin[ 2005765 ], 2976, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.register", NULL, &constant_bin[ 2008741 ], 10188, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.sdist", NULL, &constant_bin[ 2018929 ], 16657, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.command.upload", NULL, &constant_bin[ 2035586 ], 6308, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.config", NULL, &constant_bin[ 2041894 ], 3548, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.core", NULL, &constant_bin[ 2045442 ], 7634, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.cygwinccompiler", NULL, &constant_bin[ 2053076 ], 9793, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.debug", NULL, &constant_bin[ 2062869 ], 244, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.dep_util", NULL, &constant_bin[ 2063113 ], 3164, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.dir_util", NULL, &constant_bin[ 2066277 ], 6764, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.dist", NULL, &constant_bin[ 2073041 ], 39429, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.emxccompiler", NULL, &constant_bin[ 2112470 ], 7441, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.errors", NULL, &constant_bin[ 2119911 ], 6237, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.extension", NULL, &constant_bin[ 2126148 ], 7396, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.fancy_getopt", NULL, &constant_bin[ 2133544 ], 11908, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.file_util", NULL, &constant_bin[ 2145452 ], 6732, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.filelist", NULL, &constant_bin[ 2152184 ], 10714, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.log", NULL, &constant_bin[ 2162898 ], 2754, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.msvc9compiler", NULL, &constant_bin[ 2165652 ], 21439, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.msvccompiler", NULL, &constant_bin[ 2187091 ], 17465, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.spawn", NULL, &constant_bin[ 2204556 ], 6377, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.sysconfig", NULL, &constant_bin[ 2210933 ], 15100, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.text_file", NULL, &constant_bin[ 2226033 ], 9229, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.unixccompiler", NULL, &constant_bin[ 2235262 ], 8028, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.util", NULL, &constant_bin[ 2243290 ], 14315, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.version", NULL, &constant_bin[ 2257605 ], 7170, NUITKA_BYTECODE_FLAG },
    { (char *)"distutils.versionpredicate", NULL, &constant_bin[ 2264775 ], 5520, NUITKA_BYTECODE_FLAG },
    { (char *)"doctest", NULL, &constant_bin[ 2270295 ], 83440, NUITKA_BYTECODE_FLAG },
    { (char *)"dumbdbm", NULL, &constant_bin[ 2353735 ], 6538, NUITKA_BYTECODE_FLAG },
    { (char *)"dummy_thread", NULL, &constant_bin[ 2360273 ], 5356, NUITKA_BYTECODE_FLAG },
    { (char *)"dummy_threading", NULL, &constant_bin[ 2365629 ], 1275, NUITKA_BYTECODE_FLAG },
    { (char *)"email", NULL, &constant_bin[ 2366904 ], 2852, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"email._parseaddr", NULL, &constant_bin[ 2369756 ], 13763, NUITKA_BYTECODE_FLAG },
    { (char *)"email.base64mime", NULL, &constant_bin[ 2383519 ], 5305, NUITKA_BYTECODE_FLAG },
    { (char *)"email.charset", NULL, &constant_bin[ 2388824 ], 13499, NUITKA_BYTECODE_FLAG },
    { (char *)"email.encoders", NULL, &constant_bin[ 2402323 ], 2210, NUITKA_BYTECODE_FLAG },
    { (char *)"email.errors", NULL, &constant_bin[ 2404533 ], 3491, NUITKA_BYTECODE_FLAG },
    { (char *)"email.feedparser", NULL, &constant_bin[ 2408024 ], 11516, NUITKA_BYTECODE_FLAG },
    { (char *)"email.generator", NULL, &constant_bin[ 2419540 ], 10334, NUITKA_BYTECODE_FLAG },
    { (char *)"email.header", NULL, &constant_bin[ 2429874 ], 13622, NUITKA_BYTECODE_FLAG },
    { (char *)"email.iterators", NULL, &constant_bin[ 2443496 ], 2348, NUITKA_BYTECODE_FLAG },
    { (char *)"email.message", NULL, &constant_bin[ 2445844 ], 28576, NUITKA_BYTECODE_FLAG },
    { (char *)"email.mime", NULL, &constant_bin[ 2474420 ], 120, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"email.mime.application", NULL, &constant_bin[ 2474540 ], 1570, NUITKA_BYTECODE_FLAG },
    { (char *)"email.mime.audio", NULL, &constant_bin[ 2476110 ], 2893, NUITKA_BYTECODE_FLAG },
    { (char *)"email.mime.base", NULL, &constant_bin[ 2479003 ], 1102, NUITKA_BYTECODE_FLAG },
    { (char *)"email.mime.image", NULL, &constant_bin[ 2480105 ], 2035, NUITKA_BYTECODE_FLAG },
    { (char *)"email.mime.message", NULL, &constant_bin[ 2482140 ], 1434, NUITKA_BYTECODE_FLAG },
    { (char *)"email.mime.multipart", NULL, &constant_bin[ 2483574 ], 1655, NUITKA_BYTECODE_FLAG },
    { (char *)"email.mime.nonmultipart", NULL, &constant_bin[ 2485229 ], 874, NUITKA_BYTECODE_FLAG },
    { (char *)"email.mime.text", NULL, &constant_bin[ 2486103 ], 1294, NUITKA_BYTECODE_FLAG },
    { (char *)"email.parser", NULL, &constant_bin[ 2487397 ], 3804, NUITKA_BYTECODE_FLAG },
    { (char *)"email.quoprimime", NULL, &constant_bin[ 2491201 ], 8816, NUITKA_BYTECODE_FLAG },
    { (char *)"email.utils", NULL, &constant_bin[ 2500017 ], 9082, NUITKA_BYTECODE_FLAG },
    { (char *)"encodings.mbcs", NULL, &constant_bin[ 2509099 ], 2019, NUITKA_BYTECODE_FLAG },
    { (char *)"filecmp", NULL, &constant_bin[ 2511118 ], 9574, NUITKA_BYTECODE_FLAG },
    { (char *)"fileinput", NULL, &constant_bin[ 2520692 ], 14436, NUITKA_BYTECODE_FLAG },
    { (char *)"fnmatch", NULL, &constant_bin[ 2535128 ], 3594, NUITKA_BYTECODE_FLAG },
    { (char *)"formatter", NULL, &constant_bin[ 2538722 ], 19016, NUITKA_BYTECODE_FLAG },
    { (char *)"fpformat", NULL, &constant_bin[ 2557738 ], 4648, NUITKA_BYTECODE_FLAG },
    { (char *)"fractions", NULL, &constant_bin[ 2562386 ], 19647, NUITKA_BYTECODE_FLAG },
    { (char *)"ftplib", NULL, &constant_bin[ 2582033 ], 34434, NUITKA_BYTECODE_FLAG },
    { (char *)"genericpath", NULL, &constant_bin[ 2616467 ], 3487, NUITKA_BYTECODE_FLAG },
    { (char *)"getopt", NULL, &constant_bin[ 2619954 ], 6626, NUITKA_BYTECODE_FLAG },
    { (char *)"getpass", NULL, &constant_bin[ 2626580 ], 4722, NUITKA_BYTECODE_FLAG },
    { (char *)"gettext", NULL, &constant_bin[ 2631302 ], 15628, NUITKA_BYTECODE_FLAG },
    { (char *)"glob", NULL, &constant_bin[ 2646930 ], 2919, NUITKA_BYTECODE_FLAG },
    { (char *)"gzip", NULL, &constant_bin[ 2649849 ], 15126, NUITKA_BYTECODE_FLAG },
    { (char *)"hashlib", NULL, &constant_bin[ 2664975 ], 7041, NUITKA_BYTECODE_FLAG },
    { (char *)"heapq", NULL, &constant_bin[ 2672016 ], 14520, NUITKA_BYTECODE_FLAG },
    { (char *)"hmac", NULL, &constant_bin[ 2686536 ], 4514, NUITKA_BYTECODE_FLAG },
    { (char *)"hotshot", NULL, &constant_bin[ 2691050 ], 3454, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"hotshot.log", NULL, &constant_bin[ 2694504 ], 5507, NUITKA_BYTECODE_FLAG },
    { (char *)"hotshot.stats", NULL, &constant_bin[ 2700011 ], 3374, NUITKA_BYTECODE_FLAG },
    { (char *)"hotshot.stones", NULL, &constant_bin[ 2703385 ], 1144, NUITKA_BYTECODE_FLAG },
    { (char *)"htmlentitydefs", NULL, &constant_bin[ 2704529 ], 6357, NUITKA_BYTECODE_FLAG },
    { (char *)"htmllib", NULL, &constant_bin[ 2710886 ], 20119, NUITKA_BYTECODE_FLAG },
    { (char *)"httplib", NULL, &constant_bin[ 2731005 ], 36745, NUITKA_BYTECODE_FLAG },
    { (char *)"ihooks", NULL, &constant_bin[ 2767750 ], 21226, NUITKA_BYTECODE_FLAG },
    { (char *)"imaplib", NULL, &constant_bin[ 2788976 ], 45155, NUITKA_BYTECODE_FLAG },
    { (char *)"imghdr", NULL, &constant_bin[ 2834131 ], 4798, NUITKA_BYTECODE_FLAG },
    { (char *)"importlib", NULL, &constant_bin[ 2838929 ], 1488, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"imputil", NULL, &constant_bin[ 2840417 ], 15539, NUITKA_BYTECODE_FLAG },
    { (char *)"inspect", NULL, &constant_bin[ 2855956 ], 39936, NUITKA_BYTECODE_FLAG },
    { (char *)"io", NULL, &constant_bin[ 2895892 ], 3570, NUITKA_BYTECODE_FLAG },
    { (char *)"json", NULL, &constant_bin[ 2899462 ], 13937, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"json.decoder", NULL, &constant_bin[ 2913399 ], 11928, NUITKA_BYTECODE_FLAG },
    { (char *)"json.encoder", NULL, &constant_bin[ 2925327 ], 13668, NUITKA_BYTECODE_FLAG },
    { (char *)"json.scanner", NULL, &constant_bin[ 2938995 ], 2215, NUITKA_BYTECODE_FLAG },
    { (char *)"json.tool", NULL, &constant_bin[ 2941210 ], 1282, NUITKA_BYTECODE_FLAG },
    { (char *)"keyword", NULL, &constant_bin[ 2942492 ], 2093, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3", NULL, &constant_bin[ 2944585 ], 117, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"lib2to3.btm_matcher", NULL, &constant_bin[ 2944702 ], 5800, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.btm_utils", NULL, &constant_bin[ 2950502 ], 7529, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixer_base", NULL, &constant_bin[ 2958031 ], 7216, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixer_util", NULL, &constant_bin[ 2965247 ], 14607, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes", NULL, &constant_bin[ 2979854 ], 123, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"lib2to3.fixes.fix_apply", NULL, &constant_bin[ 2979977 ], 1869, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_asserts", NULL, &constant_bin[ 2981846 ], 1547, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_basestring", NULL, &constant_bin[ 2983393 ], 793, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_buffer", NULL, &constant_bin[ 2984186 ], 950, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_callable", NULL, &constant_bin[ 2985136 ], 1493, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_dict", NULL, &constant_bin[ 2986629 ], 3753, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_except", NULL, &constant_bin[ 2990382 ], 2993, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_exec", NULL, &constant_bin[ 2993375 ], 1418, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_execfile", NULL, &constant_bin[ 2994793 ], 2059, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_exitfunc", NULL, &constant_bin[ 2996852 ], 2739, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_filter", NULL, &constant_bin[ 2999591 ], 2256, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_funcattrs", NULL, &constant_bin[ 3001847 ], 1114, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_future", NULL, &constant_bin[ 3002961 ], 919, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_getcwdu", NULL, &constant_bin[ 3003880 ], 926, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_has_key", NULL, &constant_bin[ 3004806 ], 3184, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_idioms", NULL, &constant_bin[ 3007990 ], 4515, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_import", NULL, &constant_bin[ 3012505 ], 3233, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_imports", NULL, &constant_bin[ 3015738 ], 5352, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_imports2", NULL, &constant_bin[ 3021090 ], 622, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_input", NULL, &constant_bin[ 3021712 ], 1134, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_intern", NULL, &constant_bin[ 3022846 ], 1605, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_isinstance", NULL, &constant_bin[ 3024451 ], 1838, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_itertools", NULL, &constant_bin[ 3026289 ], 1791, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_itertools_imports", NULL, &constant_bin[ 3028080 ], 2016, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_long", NULL, &constant_bin[ 3030096 ], 841, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_map", NULL, &constant_bin[ 3030937 ], 3040, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_metaclass", NULL, &constant_bin[ 3033977 ], 6579, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_methodattrs", NULL, &constant_bin[ 3040556 ], 1138, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_ne", NULL, &constant_bin[ 3041694 ], 985, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_next", NULL, &constant_bin[ 3042679 ], 3531, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_nonzero", NULL, &constant_bin[ 3046210 ], 1086, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_numliterals", NULL, &constant_bin[ 3047296 ], 1249, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_operator", NULL, &constant_bin[ 3048545 ], 5112, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_paren", NULL, &constant_bin[ 3053657 ], 1543, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_print", NULL, &constant_bin[ 3055200 ], 2727, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_raise", NULL, &constant_bin[ 3057927 ], 2498, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_raw_input", NULL, &constant_bin[ 3060425 ], 936, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_reduce", NULL, &constant_bin[ 3061361 ], 1262, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_renames", NULL, &constant_bin[ 3062623 ], 2449, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_repr", NULL, &constant_bin[ 3065072 ], 1016, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_set_literal", NULL, &constant_bin[ 3066088 ], 1988, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_standarderror", NULL, &constant_bin[ 3068076 ], 853, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_sys_exc", NULL, &constant_bin[ 3068929 ], 1705, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_throw", NULL, &constant_bin[ 3070634 ], 1996, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_tuple_params", NULL, &constant_bin[ 3072630 ], 5430, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_types", NULL, &constant_bin[ 3078060 ], 2196, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_unicode", NULL, &constant_bin[ 3080256 ], 1716, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_urllib", NULL, &constant_bin[ 3081972 ], 7134, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_ws_comma", NULL, &constant_bin[ 3089106 ], 1382, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_xrange", NULL, &constant_bin[ 3090488 ], 3063, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_xreadlines", NULL, &constant_bin[ 3093551 ], 1152, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.fixes.fix_zip", NULL, &constant_bin[ 3094703 ], 1346, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.main", NULL, &constant_bin[ 3096049 ], 9803, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.patcomp", NULL, &constant_bin[ 3105852 ], 6634, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.pgen2", NULL, &constant_bin[ 3112486 ], 164, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"lib2to3.pgen2.conv", NULL, &constant_bin[ 3112650 ], 8169, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.pgen2.driver", NULL, &constant_bin[ 3120819 ], 5363, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.pgen2.grammar", NULL, &constant_bin[ 3126182 ], 6004, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.pgen2.literals", NULL, &constant_bin[ 3132186 ], 2002, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.pgen2.parse", NULL, &constant_bin[ 3134188 ], 7204, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.pgen2.pgen", NULL, &constant_bin[ 3141392 ], 12101, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.pgen2.token", NULL, &constant_bin[ 3153493 ], 2287, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.pgen2.tokenize", NULL, &constant_bin[ 3155780 ], 16923, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.pygram", NULL, &constant_bin[ 3172703 ], 1400, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.pytree", NULL, &constant_bin[ 3174103 ], 30143, NUITKA_BYTECODE_FLAG },
    { (char *)"lib2to3.refactor", NULL, &constant_bin[ 3204246 ], 23866, NUITKA_BYTECODE_FLAG },
    { (char *)"linecache", NULL, &constant_bin[ 3228112 ], 3252, NUITKA_BYTECODE_FLAG },
    { (char *)"logging", NULL, &constant_bin[ 3231364 ], 57300, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"logging.config", NULL, &constant_bin[ 3288664 ], 25834, NUITKA_BYTECODE_FLAG },
    { (char *)"logging.handlers", NULL, &constant_bin[ 3314498 ], 39156, NUITKA_BYTECODE_FLAG },
    { (char *)"macpath", NULL, &constant_bin[ 3353654 ], 7635, NUITKA_BYTECODE_FLAG },
    { (char *)"macurl2path", NULL, &constant_bin[ 3361289 ], 2228, NUITKA_BYTECODE_FLAG },
    { (char *)"mailbox", NULL, &constant_bin[ 3363517 ], 76279, NUITKA_BYTECODE_FLAG },
    { (char *)"mailcap", NULL, &constant_bin[ 3439796 ], 7045, NUITKA_BYTECODE_FLAG },
    { (char *)"markupbase", NULL, &constant_bin[ 3446841 ], 9268, NUITKA_BYTECODE_FLAG },
    { (char *)"md5", NULL, &constant_bin[ 3456109 ], 368, NUITKA_BYTECODE_FLAG },
    { (char *)"mhlib", NULL, &constant_bin[ 3456477 ], 33653, NUITKA_BYTECODE_FLAG },
    { (char *)"mimetools", NULL, &constant_bin[ 3490130 ], 8176, NUITKA_BYTECODE_FLAG },
    { (char *)"mimetypes", NULL, &constant_bin[ 3498306 ], 18385, NUITKA_BYTECODE_FLAG },
    { (char *)"mimify", NULL, &constant_bin[ 3516691 ], 11963, NUITKA_BYTECODE_FLAG },
    { (char *)"modulefinder", NULL, &constant_bin[ 3528654 ], 19074, NUITKA_BYTECODE_FLAG },
    { (char *)"multifile", NULL, &constant_bin[ 3547728 ], 5382, NUITKA_BYTECODE_FLAG },
    { (char *)"multiprocessing", NULL, &constant_bin[ 3553110 ], 8405, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"multiprocessing.connection", NULL, &constant_bin[ 3561515 ], 14354, NUITKA_BYTECODE_FLAG },
    { (char *)"multiprocessing.dummy", NULL, &constant_bin[ 3575869 ], 5412, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"multiprocessing.dummy.connection", NULL, &constant_bin[ 3581281 ], 2732, NUITKA_BYTECODE_FLAG },
    { (char *)"multiprocessing.forking", NULL, &constant_bin[ 3584013 ], 14336, NUITKA_BYTECODE_FLAG },
    { (char *)"multiprocessing.heap", NULL, &constant_bin[ 3598349 ], 6861, NUITKA_BYTECODE_FLAG },
    { (char *)"multiprocessing.managers", NULL, &constant_bin[ 3605210 ], 38278, NUITKA_BYTECODE_FLAG },
    { (char *)"multiprocessing.pool", NULL, &constant_bin[ 3643488 ], 22367, NUITKA_BYTECODE_FLAG },
    { (char *)"multiprocessing.process", NULL, &constant_bin[ 3665855 ], 9435, NUITKA_BYTECODE_FLAG },
    { (char *)"multiprocessing.queues", NULL, &constant_bin[ 3675290 ], 11466, NUITKA_BYTECODE_FLAG },
    { (char *)"multiprocessing.reduction", NULL, &constant_bin[ 3686756 ], 5972, NUITKA_BYTECODE_FLAG },
    { (char *)"multiprocessing.sharedctypes", NULL, &constant_bin[ 3692728 ], 8572, NUITKA_BYTECODE_FLAG },
    { (char *)"multiprocessing.synchronize", NULL, &constant_bin[ 3701300 ], 10988, NUITKA_BYTECODE_FLAG },
    { (char *)"multiprocessing.util", NULL, &constant_bin[ 3712288 ], 10066, NUITKA_BYTECODE_FLAG },
    { (char *)"mutex", NULL, &constant_bin[ 3722354 ], 2494, NUITKA_BYTECODE_FLAG },
    { (char *)"netrc", NULL, &constant_bin[ 3724848 ], 4646, NUITKA_BYTECODE_FLAG },
    { (char *)"new", NULL, &constant_bin[ 3729494 ], 852, NUITKA_BYTECODE_FLAG },
    { (char *)"nntplib", NULL, &constant_bin[ 3730346 ], 20948, NUITKA_BYTECODE_FLAG },
    { (char *)"ntpath", NULL, &constant_bin[ 3751294 ], 13077, NUITKA_BYTECODE_FLAG },
    { (char *)"nturl2path", NULL, &constant_bin[ 3764371 ], 1801, NUITKA_BYTECODE_FLAG },
    { (char *)"numbers", NULL, &constant_bin[ 3766172 ], 13880, NUITKA_BYTECODE_FLAG },
    { (char *)"opcode", NULL, &constant_bin[ 3780052 ], 6134, NUITKA_BYTECODE_FLAG },
    { (char *)"optparse", NULL, &constant_bin[ 3786186 ], 53841, NUITKA_BYTECODE_FLAG },
    { (char *)"os", NULL, &constant_bin[ 3840027 ], 25585, NUITKA_BYTECODE_FLAG },
    { (char *)"os2emxpath", NULL, &constant_bin[ 3865612 ], 4499, NUITKA_BYTECODE_FLAG },
    { (char *)"pdb", NULL, &constant_bin[ 3870111 ], 43433, NUITKA_BYTECODE_FLAG },
    { (char *)"pickle", NULL, &constant_bin[ 3913544 ], 38342, NUITKA_BYTECODE_FLAG },
    { (char *)"pickletools", NULL, &constant_bin[ 3951886 ], 57072, NUITKA_BYTECODE_FLAG },
    { (char *)"pipes", NULL, &constant_bin[ 4008958 ], 9268, NUITKA_BYTECODE_FLAG },
    { (char *)"pkgutil", NULL, &constant_bin[ 4018226 ], 18859, NUITKA_BYTECODE_FLAG },
    { (char *)"platform", NULL, &constant_bin[ 4037085 ], 37615, NUITKA_BYTECODE_FLAG },
    { (char *)"plistlib", NULL, &constant_bin[ 4074700 ], 19143, NUITKA_BYTECODE_FLAG },
    { (char *)"popen2", NULL, &constant_bin[ 4093843 ], 8985, NUITKA_BYTECODE_FLAG },
    { (char *)"poplib", NULL, &constant_bin[ 4102828 ], 13270, NUITKA_BYTECODE_FLAG },
    { (char *)"posixfile", NULL, &constant_bin[ 4116098 ], 7620, NUITKA_BYTECODE_FLAG },
    { (char *)"posixpath", NULL, &constant_bin[ 4123718 ], 11366, NUITKA_BYTECODE_FLAG },
    { (char *)"pprint", NULL, &constant_bin[ 4135084 ], 10148, NUITKA_BYTECODE_FLAG },
    { (char *)"profile", NULL, &constant_bin[ 4145232 ], 16372, NUITKA_BYTECODE_FLAG },
    { (char *)"pstats", NULL, &constant_bin[ 4161604 ], 24885, NUITKA_BYTECODE_FLAG },
    { (char *)"pty", NULL, &constant_bin[ 4186489 ], 4938, NUITKA_BYTECODE_FLAG },
    { (char *)"py_compile", NULL, &constant_bin[ 4191427 ], 6603, NUITKA_BYTECODE_FLAG },
    { (char *)"pyclbr", NULL, &constant_bin[ 4198030 ], 9617, NUITKA_BYTECODE_FLAG },
    { (char *)"pydoc", NULL, &constant_bin[ 4207647 ], 92288, NUITKA_BYTECODE_FLAG },
    { (char *)"pydoc_data", NULL, &constant_bin[ 4299935 ], 120, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"pydoc_data.topics", NULL, &constant_bin[ 4300055 ], 409111, NUITKA_BYTECODE_FLAG },
    { (char *)"random", NULL, &constant_bin[ 4709166 ], 25476, NUITKA_BYTECODE_FLAG },
    { (char *)"repr", NULL, &constant_bin[ 4734642 ], 5343, NUITKA_BYTECODE_FLAG },
    { (char *)"rexec", NULL, &constant_bin[ 4739985 ], 24068, NUITKA_BYTECODE_FLAG },
    { (char *)"rfc822", NULL, &constant_bin[ 4764053 ], 31721, NUITKA_BYTECODE_FLAG },
    { (char *)"rlcompleter", NULL, &constant_bin[ 4795774 ], 6054, NUITKA_BYTECODE_FLAG },
    { (char *)"robotparser", NULL, &constant_bin[ 4801828 ], 7904, NUITKA_BYTECODE_FLAG },
    { (char *)"runpy", NULL, &constant_bin[ 4809732 ], 8780, NUITKA_BYTECODE_FLAG },
    { (char *)"sched", NULL, &constant_bin[ 4818512 ], 4968, NUITKA_BYTECODE_FLAG },
    { (char *)"sets", NULL, &constant_bin[ 4823480 ], 16775, NUITKA_BYTECODE_FLAG },
    { (char *)"sgmllib", NULL, &constant_bin[ 4840255 ], 15334, NUITKA_BYTECODE_FLAG },
    { (char *)"sha", NULL, &constant_bin[ 4855589 ], 411, NUITKA_BYTECODE_FLAG },
    { (char *)"shelve", NULL, &constant_bin[ 4856000 ], 10194, NUITKA_BYTECODE_FLAG },
    { (char *)"shlex", NULL, &constant_bin[ 4866194 ], 7509, NUITKA_BYTECODE_FLAG },
    { (char *)"shutil", NULL, &constant_bin[ 4873703 ], 18547, NUITKA_BYTECODE_FLAG },
    { (char *)"site", NULL, &constant_bin[ 4892250 ], 17118, NUITKA_BYTECODE_FLAG },
    { (char *)"sitecustomize", NULL, &constant_bin[ 4909368 ], 224, NUITKA_BYTECODE_FLAG },
    { (char *)"smtpd", NULL, &constant_bin[ 4909592 ], 15826, NUITKA_BYTECODE_FLAG },
    { (char *)"smtplib", NULL, &constant_bin[ 4925418 ], 30169, NUITKA_BYTECODE_FLAG },
    { (char *)"sndhdr", NULL, &constant_bin[ 4955587 ], 7315, NUITKA_BYTECODE_FLAG },
    { (char *)"socket", NULL, &constant_bin[ 4962902 ], 16084, NUITKA_BYTECODE_FLAG },
    { (char *)"sqlite3", NULL, &constant_bin[ 4978986 ], 154, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"sqlite3.dbapi2", NULL, &constant_bin[ 4979140 ], 2682, NUITKA_BYTECODE_FLAG },
    { (char *)"sqlite3.dump", NULL, &constant_bin[ 4981822 ], 2057, NUITKA_BYTECODE_FLAG },
    { (char *)"sre", NULL, &constant_bin[ 4983879 ], 509, NUITKA_BYTECODE_FLAG },
    { (char *)"ssl", NULL, &constant_bin[ 4984388 ], 32205, NUITKA_BYTECODE_FLAG },
    { (char *)"stat", NULL, &constant_bin[ 5016593 ], 2723, NUITKA_BYTECODE_FLAG },
    { (char *)"statvfs", NULL, &constant_bin[ 5019316 ], 610, NUITKA_BYTECODE_FLAG },
    { (char *)"stringold", NULL, &constant_bin[ 5019926 ], 12487, NUITKA_BYTECODE_FLAG },
    { (char *)"subprocess", NULL, &constant_bin[ 5032413 ], 42004, NUITKA_BYTECODE_FLAG },
    { (char *)"sunau", NULL, &constant_bin[ 5074417 ], 18301, NUITKA_BYTECODE_FLAG },
    { (char *)"sunaudio", NULL, &constant_bin[ 5092718 ], 1969, NUITKA_BYTECODE_FLAG },
    { (char *)"symbol", NULL, &constant_bin[ 5094687 ], 3014, NUITKA_BYTECODE_FLAG },
    { (char *)"symtable", NULL, &constant_bin[ 5097701 ], 11678, NUITKA_BYTECODE_FLAG },
    { (char *)"sysconfig", NULL, &constant_bin[ 5109379 ], 18670, NUITKA_BYTECODE_FLAG },
    { (char *)"tabnanny", NULL, &constant_bin[ 5128049 ], 8195, NUITKA_BYTECODE_FLAG },
    { (char *)"tarfile", NULL, &constant_bin[ 5136244 ], 75638, NUITKA_BYTECODE_FLAG },
    { (char *)"telnetlib", NULL, &constant_bin[ 5211882 ], 23073, NUITKA_BYTECODE_FLAG },
    { (char *)"tempfile", NULL, &constant_bin[ 5234955 ], 20241, NUITKA_BYTECODE_FLAG },
    { (char *)"test", NULL, &constant_bin[ 5255196 ], 114, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"test.pystone", NULL, &constant_bin[ 5255310 ], 7981, NUITKA_BYTECODE_FLAG },
    { (char *)"textwrap", NULL, &constant_bin[ 5263291 ], 11996, NUITKA_BYTECODE_FLAG },
    { (char *)"this", NULL, &constant_bin[ 5275287 ], 1210, NUITKA_BYTECODE_FLAG },
    { (char *)"threading", NULL, &constant_bin[ 5276497 ], 42422, NUITKA_BYTECODE_FLAG },
    { (char *)"timeit", NULL, &constant_bin[ 5318919 ], 12149, NUITKA_BYTECODE_FLAG },
    { (char *)"tkColorChooser", NULL, &constant_bin[ 5331068 ], 1402, NUITKA_BYTECODE_FLAG },
    { (char *)"tkCommonDialog", NULL, &constant_bin[ 5332470 ], 1496, NUITKA_BYTECODE_FLAG },
    { (char *)"tkFileDialog", NULL, &constant_bin[ 5333966 ], 5121, NUITKA_BYTECODE_FLAG },
    { (char *)"tkFont", NULL, &constant_bin[ 5339087 ], 7076, NUITKA_BYTECODE_FLAG },
    { (char *)"tkMessageBox", NULL, &constant_bin[ 5346163 ], 3864, NUITKA_BYTECODE_FLAG },
    { (char *)"tkSimpleDialog", NULL, &constant_bin[ 5350027 ], 9053, NUITKA_BYTECODE_FLAG },
    { (char *)"toaiff", NULL, &constant_bin[ 5359080 ], 3090, NUITKA_BYTECODE_FLAG },
    { (char *)"token", NULL, &constant_bin[ 5362170 ], 3798, NUITKA_BYTECODE_FLAG },
    { (char *)"tokenize", NULL, &constant_bin[ 5365968 ], 14465, NUITKA_BYTECODE_FLAG },
    { (char *)"trace", NULL, &constant_bin[ 5380433 ], 22716, NUITKA_BYTECODE_FLAG },
    { (char *)"traceback", NULL, &constant_bin[ 5403149 ], 11631, NUITKA_BYTECODE_FLAG },
    { (char *)"ttk", NULL, &constant_bin[ 5414780 ], 62193, NUITKA_BYTECODE_FLAG },
    { (char *)"tty", NULL, &constant_bin[ 5476973 ], 1303, NUITKA_BYTECODE_FLAG },
    { (char *)"turtle", NULL, &constant_bin[ 5478276 ], 139008, NUITKA_BYTECODE_FLAG },
    { (char *)"unittest", NULL, &constant_bin[ 5617284 ], 2954, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"unittest.case", NULL, &constant_bin[ 5620238 ], 40172, NUITKA_BYTECODE_FLAG },
    { (char *)"unittest.loader", NULL, &constant_bin[ 5660410 ], 11299, NUITKA_BYTECODE_FLAG },
    { (char *)"unittest.main", NULL, &constant_bin[ 5671709 ], 7985, NUITKA_BYTECODE_FLAG },
    { (char *)"unittest.result", NULL, &constant_bin[ 5679694 ], 7869, NUITKA_BYTECODE_FLAG },
    { (char *)"unittest.runner", NULL, &constant_bin[ 5687563 ], 7599, NUITKA_BYTECODE_FLAG },
    { (char *)"unittest.signals", NULL, &constant_bin[ 5695162 ], 2738, NUITKA_BYTECODE_FLAG },
    { (char *)"unittest.suite", NULL, &constant_bin[ 5697900 ], 10460, NUITKA_BYTECODE_FLAG },
    { (char *)"unittest.util", NULL, &constant_bin[ 5708360 ], 4494, NUITKA_BYTECODE_FLAG },
    { (char *)"urllib", NULL, &constant_bin[ 5712854 ], 50794, NUITKA_BYTECODE_FLAG },
    { (char *)"urllib2", NULL, &constant_bin[ 5763648 ], 47064, NUITKA_BYTECODE_FLAG },
    { (char *)"urlparse", NULL, &constant_bin[ 5810712 ], 14457, NUITKA_BYTECODE_FLAG },
    { (char *)"user", NULL, &constant_bin[ 5825169 ], 1714, NUITKA_BYTECODE_FLAG },
    { (char *)"uu", NULL, &constant_bin[ 5826883 ], 4294, NUITKA_BYTECODE_FLAG },
    { (char *)"uuid", NULL, &constant_bin[ 5831177 ], 22469, NUITKA_BYTECODE_FLAG },
    { (char *)"warnings", NULL, &constant_bin[ 5853646 ], 13570, NUITKA_BYTECODE_FLAG },
    { (char *)"wave", NULL, &constant_bin[ 5867216 ], 19911, NUITKA_BYTECODE_FLAG },
    { (char *)"weakref", NULL, &constant_bin[ 5887127 ], 15733, NUITKA_BYTECODE_FLAG },
    { (char *)"webbrowser", NULL, &constant_bin[ 5902860 ], 19681, NUITKA_BYTECODE_FLAG },
    { (char *)"whichdb", NULL, &constant_bin[ 5922541 ], 2229, NUITKA_BYTECODE_FLAG },
    { (char *)"wsgiref", NULL, &constant_bin[ 5924770 ], 719, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"wsgiref.handlers", NULL, &constant_bin[ 5925489 ], 16172, NUITKA_BYTECODE_FLAG },
    { (char *)"wsgiref.headers", NULL, &constant_bin[ 5941661 ], 7429, NUITKA_BYTECODE_FLAG },
    { (char *)"wsgiref.simple_server", NULL, &constant_bin[ 5949090 ], 6199, NUITKA_BYTECODE_FLAG },
    { (char *)"wsgiref.util", NULL, &constant_bin[ 5955289 ], 5961, NUITKA_BYTECODE_FLAG },
    { (char *)"wsgiref.validate", NULL, &constant_bin[ 5961250 ], 16786, NUITKA_BYTECODE_FLAG },
    { (char *)"xdrlib", NULL, &constant_bin[ 5978036 ], 9810, NUITKA_BYTECODE_FLAG },
    { (char *)"xml", NULL, &constant_bin[ 5987846 ], 1068, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"xml.dom", NULL, &constant_bin[ 5988914 ], 6427, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"xml.dom.NodeFilter", NULL, &constant_bin[ 5995341 ], 1112, NUITKA_BYTECODE_FLAG },
    { (char *)"xml.dom.domreg", NULL, &constant_bin[ 5996453 ], 3293, NUITKA_BYTECODE_FLAG },
    { (char *)"xml.dom.expatbuilder", NULL, &constant_bin[ 5999746 ], 33003, NUITKA_BYTECODE_FLAG },
    { (char *)"xml.dom.minicompat", NULL, &constant_bin[ 6032749 ], 3394, NUITKA_BYTECODE_FLAG },
    { (char *)"xml.dom.minidom", NULL, &constant_bin[ 6036143 ], 65227, NUITKA_BYTECODE_FLAG },
    { (char *)"xml.dom.pulldom", NULL, &constant_bin[ 6101370 ], 12986, NUITKA_BYTECODE_FLAG },
    { (char *)"xml.dom.xmlbuilder", NULL, &constant_bin[ 6114356 ], 16396, NUITKA_BYTECODE_FLAG },
    { (char *)"xml.etree", NULL, &constant_bin[ 6130752 ], 119, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"xml.etree.ElementInclude", NULL, &constant_bin[ 6130871 ], 1951, NUITKA_BYTECODE_FLAG },
    { (char *)"xml.etree.ElementPath", NULL, &constant_bin[ 6132822 ], 7560, NUITKA_BYTECODE_FLAG },
    { (char *)"xml.etree.ElementTree", NULL, &constant_bin[ 6140382 ], 34794, NUITKA_BYTECODE_FLAG },
    { (char *)"xml.etree.cElementTree", NULL, &constant_bin[ 6175176 ], 166, NUITKA_BYTECODE_FLAG },
    { (char *)"xml.parsers", NULL, &constant_bin[ 6175342 ], 304, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"xml.parsers.expat", NULL, &constant_bin[ 6175646 ], 277, NUITKA_BYTECODE_FLAG },
    { (char *)"xml.sax", NULL, &constant_bin[ 6175923 ], 3679, NUITKA_BYTECODE_FLAG | NUITKA_PACKAGE_FLAG },
    { (char *)"xml.sax._exceptions", NULL, &constant_bin[ 6179602 ], 6127, NUITKA_BYTECODE_FLAG },
    { (char *)"xml.sax.expatreader", NULL, &constant_bin[ 6185729 ], 14701, NUITKA_BYTECODE_FLAG },
    { (char *)"xml.sax.handler", NULL, &constant_bin[ 6200430 ], 12970, NUITKA_BYTECODE_FLAG },
    { (char *)"xml.sax.saxutils", NULL, &constant_bin[ 6213400 ], 14685, NUITKA_BYTECODE_FLAG },
    { (char *)"xml.sax.xmlreader", NULL, &constant_bin[ 6228085 ], 19078, NUITKA_BYTECODE_FLAG },
    { (char *)"xmllib", NULL, &constant_bin[ 6247163 ], 26732, NUITKA_BYTECODE_FLAG },
    { (char *)"xmlrpclib", NULL, &constant_bin[ 6273895 ], 43832, NUITKA_BYTECODE_FLAG },
    { (char *)"zipfile", NULL, &constant_bin[ 6317727 ], 41594, NUITKA_BYTECODE_FLAG },
    { NULL, NULL, 0 }
};

void setupMetaPathBasedLoader( void )
{
    static bool init_done = false;

    if ( init_done == false )
    {
        registerMetaPathBasedUnfreezer( meta_path_loader_entries );
        init_done = true;
    }
}
